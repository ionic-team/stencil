import { BUILD } from '@app-data';
import { updateFallbackSlotVisibility } from './vdom/render-slot-fallback';

import type * as d from '../declarations';
import { NODE_TYPE, ORG_LOCATION_ID } from './runtime-constants';

interface PatchedNode extends d.HostElement {
  __removeChild: (node: ChildNode) => void;
}

export const patchPseudoShadowDom = (HostElementPrototype: any, DescriptorPrototype?: any) => {
  patchChildNodes(HostElementPrototype, DescriptorPrototype);
  patchInsertBefore(HostElementPrototype);
  patchAppendChild(HostElementPrototype);
  patchAppend(HostElementPrototype);
  patchPrepend(HostElementPrototype);
  patchInsertAdjacentHTML(HostElementPrototype);
  patchInsertAdjacentText(HostElementPrototype);
  patchInsertAdjacentElement(HostElementPrototype);
  patchReplaceChildren(HostElementPrototype);
  patchInnerHTML(HostElementPrototype, DescriptorPrototype);
  patchInnerText(HostElementPrototype, DescriptorPrototype);
  patchTextContent(HostElementPrototype, DescriptorPrototype);
};

////// non-shadow host component patches

/**
 * Patch `cloneNode()` for non-shadow components ()
 * @param HostElementPrototype the host prototype to polyfill
 */
export const patchCloneNode = (HostElementPrototype: any) => {
  HostElementPrototype.__cloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function (deep?: boolean) {
    const srcNode: PatchedNode = this;
    const clonedNode: PatchedNode = HostElementPrototype.__cloneNode.call(srcNode, false);
    if (BUILD.slot && deep) {
      let i = 0;
      let slotted, nonStencilNode;
      const stencilPrivates = [
        's-id',
        's-cr',
        's-lr',
        's-rc',
        's-sc',
        's-p',
        's-cn',
        's-sr',
        's-sn',
        's-hn',
        's-ol',
        's-nr',
        's-si',
        's-sf',
        's-sfc',
        's-hsf',
      ];

      for (; i < srcNode.__childNodes.length; i++) {
        slotted = (srcNode.__childNodes[i] as any)['s-nr'];
        nonStencilNode = stencilPrivates.every((privateField) => !(srcNode.__childNodes[i] as any)[privateField]);

        if (slotted) {
          clonedNode.__appendChild(slotted.cloneNode(true));
        }
        if (nonStencilNode) {
          clonedNode.__appendChild((srcNode.__childNodes[i] as any).cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

/**
 * Patches children accessors of a non-shadow component.
 * (`childNodes`, `children`, `firstChild`, `lastChild` and `childElementCount`)
 * @param HostElementPrototype
 */
const patchChildNodes = (HostElementPrototype: any, DescriptorPrototype?: any) => {
  if (!globalThis.Node) return;

  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }

  let childNodesDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'childNodes');
  if (!childNodesDesc) {
    childNodesDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), 'childNodes');
  }
  if (childNodesDesc) Object.defineProperty(HostElementPrototype, '__childNodes', childNodesDesc);

  let childrenDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'children');
  // MockNode won't have these
  if (childrenDesc) Object.defineProperty(HostElementPrototype, '__children', childrenDesc);

  const childElementCountDesc = Object.getOwnPropertyDescriptor(
    DescriptorPrototype || Element.prototype,
    'childElementCount'
  );
  if (childElementCountDesc) Object.defineProperty(HostElementPrototype, '__childElementCount', childElementCountDesc);

  Object.defineProperty(HostElementPrototype, 'children', {
    get() {
      return (this.childNodes as FakeNodeList)
        .map((n: Node) => {
          if (n.nodeType === NODE_TYPE.ElementNode) return n;
          else return null;
        })
        .filter((n) => !!n);
    },
  });
  Object.defineProperty(HostElementPrototype, 'firstChild', {
    get() {
      return this.childNodes[0];
    },
  });
  Object.defineProperty(HostElementPrototype, 'lastChild', {
    get() {
      return this.childNodes[this.childNodes.length - 1];
    },
  });
  Object.defineProperty(HostElementPrototype, 'childElementCount', {
    get() {
      return HostElementPrototype.children.length;
    },
  });
  if (!childNodesDesc) return;

  Object.defineProperty(HostElementPrototype, 'childNodes', {
    get() {
      const childNodes = this.__childNodes as d.RenderNode[];
      const result = new FakeNodeList();
      for (let i = 0; i < childNodes.length; i++) {
        const slottedNode = childNodes[i]['s-nr'];
        if (
          slottedNode &&
          (slottedNode.nodeType !== NODE_TYPE.CommentNode || slottedNode.nodeValue.indexOf(ORG_LOCATION_ID + '.') !== 0)
        ) {
          result.push(slottedNode);
        }
      }
      return result;
    },
  });
};

/**
 * Patches the inner html accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerHTML = (HostElementPrototype: any, DescriptorPrototype?: any) => {
  if (!globalThis.Element) return;

  let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerHTML');
  // on IE it's on HTMLElement.prototype
  if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
  // MockNode won't have these
  if (descriptor) Object.defineProperty(HostElementPrototype, '__innerHTML', descriptor);

  Object.defineProperty(HostElementPrototype, 'innerHTML', {
    get: function () {
      let html = '';
      this.childNodes.forEach((node: d.RenderNode) => (html += node.outerHTML || node.textContent));
      return html;
    },
    set: function (value) {
      this.childNodes.forEach((node: d.RenderNode) => {
        if (node['s-ol']) {
          try {
            node['s-ol'].remove();
          } catch (e) {}
        }
        node.remove();
      });
      this.insertAdjacentHTML('beforeend', value);
    },
  });
};

/**
 * Patches the inner text accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerText = (HostElementPrototype: any, DescriptorPrototype?: any) => {
  if (!globalThis.Element) return;

  let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerText');
  // on IE it's on HTMLElement.prototype
  if (!descriptor) descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
  // MockNode won't have these
  if (descriptor) Object.defineProperty(HostElementPrototype, '__innerText', descriptor);

  Object.defineProperty(HostElementPrototype, 'innerText', {
    get: function () {
      let text = '';
      this.childNodes.forEach((node: d.RenderNode) => {
        if (node.innerText) text += node.innerText;
        else if (node.textContent) text += node.textContent.trimEnd();
      });
      return text;
    },
    set: function (value) {
      this.childNodes.forEach((node: d.RenderNode) => {
        if (node['s-ol']) node['s-ol'].remove();
        node.remove();
      });
      this.insertAdjacentHTML('beforeend', value);
    },
  });
};

/**
 * Patches the text content accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchTextContent = (HostElementPrototype: any, DescriptorPrototype?: any) => {
  if (!globalThis.Node) return;

  const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'textContent');
  // MockNode won't have these
  if (descriptor) Object.defineProperty(HostElementPrototype, '__textContent', descriptor);

  Object.defineProperty(HostElementPrototype, 'textContent', {
    get: function () {
      let text = '';
      this.childNodes.forEach((node: d.RenderNode) => (text += node.textContent || ''));
      return text;
    },
    set: function (value) {
      this.childNodes.forEach((node: d.RenderNode) => {
        if (node['s-ol']) node['s-ol'].remove();
        node.remove();
      });
      this.insertAdjacentHTML('beforeend', value);
    },
  });
};

/**
 * Patches the `insertBefore` of a non-shadow component.
 * The problem solved being that the 'current' node to insert before may not be in the root of our component.
 * This tries to find where the 'current' node lives within the component and insert the new node before it
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertBefore = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertBefore) return;

  HostElementPrototype.__insertBefore = HostElementPrototype.insertBefore;
  HostElementPrototype.insertBefore = function (this: PatchedNode, newChild: d.RenderNode, curChild: d.RenderNode) {
    const slotName = (newChild['s-sn'] = getSlotName(newChild));
    const slotNode = getHostSlotNode(this.__childNodes, slotName);

    if (slotNode) {
      let found = false;
      this.childNodes.forEach((childNode) => {
        // we found the node in our list of other 'lightDOM' / slotted nodes
        if (childNode === curChild || curChild === null) {
          found = true;
          addSlotRelocateNode(newChild, slotNode);
          if (curChild === null) {
            this.__append(newChild);
            return;
          }

          if (slotName === curChild['s-sn']) {
            // current child ('slot before' node) is 'in' the same slot
            const insertBefore =
              (curChild.parentNode as PatchedNode).__insertBefore || curChild.parentNode.insertBefore;
            insertBefore.call(curChild.parentNode, newChild, curChild);
            patchRemove(newChild);
          } else {
            // current child is not in the same slot as 'slot before' node
            // so just toss the node in wherever
            this.__append(newChild);
          }
          return;
        }
      });
      if (found) {
        return newChild;
      }
    }
    return (this as d.RenderNode).__insertBefore(newChild, curChild);
  };
};

/**
 * Patches the `appendChild` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppendChild = (HostElementPrototype: any) => {
  if (HostElementPrototype.__appendChild) return;

  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function (this: d.RenderNode, newChild: d.RenderNode) {
    const slotName = (newChild['s-sn'] = getSlotName(newChild));
    const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, slotName);

    if (slotNode) {
      addSlotRelocateNode(newChild, slotNode);

      const slotChildNodes = getHostSlotChildNodes(slotNode);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];

      if (appendAfter.parentNode) {
        const parent = appendAfter.parentNode as d.RenderNode;
        parent.__insertBefore
          ? parent.__insertBefore(newChild, appendAfter.nextSibling)
          : parent.insertBefore(newChild, appendAfter.nextSibling);
        patchRemove(newChild);
      }

      if (slotNode['s-hsf']) {
        updateFallbackSlotVisibility(slotNode.parentNode as d.RenderNode);
      }
      return newChild;
    }
    if (newChild.nodeType === NODE_TYPE.ElementNode && !!newChild.getAttribute('slot') && this.__childNodes)
      newChild.hidden = true;
    return (this as PatchedNode).__appendChild(newChild);
  };
};

/**
 * Patches the `prepend` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchPrepend = (HostElementPrototype: PatchedNode) => {
  if (HostElementPrototype.__prepend) return;

  HostElementPrototype.__prepend = HostElementPrototype.prepend;
  HostElementPrototype.prepend = function (this: PatchedNode, ...newChildren: (d.RenderNode | string)[]) {
    newChildren.forEach((newChild: d.RenderNode | string) => {
      if (typeof newChild === 'string') {
        newChild = this.ownerDocument.createTextNode(newChild) as unknown as d.RenderNode;
      }

      const slotName = (newChild['s-sn'] = getSlotName(newChild));
      const slotNode = getHostSlotNode(this.__childNodes, slotName);

      if (slotNode) {
        addSlotRelocateNode(newChild, slotNode);

        const slotChildNodes = getHostSlotChildNodes(slotNode);
        const appendAfter = slotChildNodes[0];

        if (appendAfter.parentNode) {
          appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
          patchRemove(newChild);
        }

        if (slotNode['s-hsf']) {
          updateFallbackSlotVisibility(slotNode.parentNode as d.RenderNode);
        }
        return;
      }
      if (newChild.nodeType === NODE_TYPE.ElementNode && !!newChild.getAttribute('slot') && this.__childNodes)
        newChild.hidden = true;
      return (this as any).__prepend(newChild);
    });
  };
};

/**
 * Patches the `append` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppend = (HostElementPrototype: PatchedNode) => {
  if (HostElementPrototype.__append) return;

  HostElementPrototype.__append = HostElementPrototype.append;
  HostElementPrototype.append = function (this: d.HostElement, ...newChildren: (d.RenderNode | string)[]) {
    newChildren.forEach((newChild: d.RenderNode | string) => {
      if (typeof newChild === 'string') {
        newChild = this.ownerDocument.createTextNode(newChild) as unknown as d.RenderNode;
      }
      this.appendChild(newChild);
    });
  };
};

/**
 * Patches the `replaceChildren` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchReplaceChildren = (HostElementPrototype: PatchedNode) => {
  if (HostElementPrototype.__replaceChildren) return;

  HostElementPrototype.__replaceChildren = HostElementPrototype.replaceChildren;
  HostElementPrototype.replaceChildren = function (this: PatchedNode, ...newChildren: (Node | string)[]) {
    const slotNode = getHostSlotNode(this.__childNodes, '');
    if (slotNode) {
      const slotChildNodes = getHostSlotChildNodes(slotNode);
      slotChildNodes.forEach((node) => {
        if (!node['s-sr']) {
          node.remove();
        }
      });
      this.append(...newChildren);
    }
  };
};

/**
 * Patches the `insertAdjacentHTML` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentHTML = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentHTML) return;

  HostElementPrototype.__insertAdjacentHTML = HostElementPrototype.insertAdjacentHTML;
  HostElementPrototype.insertAdjacentHTML = function (this: PatchedNode, position: InsertPosition, text: string) {
    if (position !== 'afterbegin' && position !== 'beforeend') {
      return (this as any).__insertAdjacentHTML(position, text);
    }

    const container = this.ownerDocument.createElement('_');
    let node: d.RenderNode;
    container.innerHTML = text;

    if (position === 'afterbegin') {
      while ((node = container.firstChild as d.RenderNode)) {
        this.prepend(node);
      }
    } else if (position === 'beforeend') {
      while ((node = container.firstChild as d.RenderNode)) {
        this.append(node);
      }
    }
  };
};

/**
 * Patches the `insertAdjacentText` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentText = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentText) return;
  HostElementPrototype.__insertAdjacentText = HostElementPrototype.insertAdjacentText;
  HostElementPrototype.insertAdjacentText = function (this: PatchedNode, position: InsertPosition, text: string) {
    this.insertAdjacentHTML(position, text);
  };
};

/**
 * Patches the `insertAdjacentElement` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentElement = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentElement) return;
  HostElementPrototype.__insertAdjacentElement = HostElementPrototype.insertAdjacentElement;
  HostElementPrototype.insertAdjacentElement = function (
    this: PatchedNode,
    position: InsertPosition,
    element: d.RenderNode
  ) {
    if (position !== 'afterbegin' && position !== 'beforeend') {
      return (this as any).__insertAdjacentElement(position, element);
    }
    if (position === 'afterbegin') {
      this.prepend(element);
    } else if (position === 'beforeend') {
      this.append(element);
    }
  };
};

////// Slotted node patches

/**
 * Patches sibling accessors (`nextSibling`, `nextSiblingElement`, `previousSibling`, `previousSiblingElement`)
 * of a 'slotted' node within a non-shadow component.
 * @param NodePrototype the slotted node to be patched
 */
export const patchNextPrev = (NodePrototype: any) => {
  // Especially relevant when rendering components via SSR.
  // Frameworks will often try to reconcile their VDOM with the real DOM
  // by stepping through nodes with 'nextSibling' (and similar).
  // This works with a shadowDOM; the lightDOM matches the framework's VDOM.
  // This doesn't work without shadowDOM

  if (!NodePrototype || NodePrototype.__nextSibling || !globalThis.Node) return;

  patchNextSibling(NodePrototype);
  patchPreviousSibling(NodePrototype);
  patchNextElementSibling(NodePrototype);
  patchPreviousElementSibling(NodePrototype);
};

/**
 * Patches the `nextSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
export const patchNextSibling = (NodePrototype: any, DescriptorPrototype?: any) => {
  if (!NodePrototype || NodePrototype.__nextSibling) return;

  const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'nextSibling');
  // MockNode might not have these
  if (descriptor) Object.defineProperty(NodePrototype, '__nextSibling', descriptor);
  else {
    NodePrototype.__nextSibling = NodePrototype.nextSibling || true;
  }

  Object.defineProperty(NodePrototype, 'nextSibling', {
    get: function () {
      const parentNodes = this['s-ol']?.parentNode.childNodes;
      const index = parentNodes?.indexOf(this);
      if (parentNodes && index > -1) {
        return parentNodes[index + 1];
      }
      return this.__nextSibling;
    },
  });
};

/**
 * Patches the `nextElementSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
export const patchNextElementSibling = (ElementPrototype: any, DescriptorPrototype?: any) => {
  if (!ElementPrototype || ElementPrototype.__nextElementSibling || !ElementPrototype.nextSiblingElement) return;

  const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'nextElementSibling');
  // MockNode won't have these
  if (descriptor) Object.defineProperty(ElementPrototype, '__nextElementSibling', descriptor);
  else {
    ElementPrototype.__nextElementSibling = ElementPrototype.nextSiblingElement || true;
  }

  Object.defineProperty(ElementPrototype, 'nextElementSibling', {
    get: function () {
      const parentEles = this['s-ol']?.parentNode.children;
      const index = parentEles?.indexOf(this);
      if (parentEles && index > -1) {
        return parentEles[index + 1];
      }
      return this.__nextElementSibling;
    },
  });
};

/**
 * Patches the `previousSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
export const patchPreviousSibling = (NodePrototype: any, DescriptorPrototype?: any) => {
  if (!NodePrototype || NodePrototype.__previousSibling) return;

  const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'previousSibling');
  // MockNode won't have these
  if (descriptor) Object.defineProperty(NodePrototype, '__previousSibling', descriptor);
  else {
    NodePrototype.__previousSibling = NodePrototype.previousSibling || true;
  }

  Object.defineProperty(NodePrototype, 'previousSibling', {
    get: function () {
      const parentNodes = this['s-ol']?.parentNode.childNodes;
      const index = parentNodes?.indexOf(this);
      if (parentNodes && index > -1) {
        return parentNodes[index - 1];
      }
      return this.__previousSibling;
    },
  });
};

/**
 * Patches the `previousElementSibling` accessor of a non-shadow slotted node
 * @param ElementPrototype the slotted node to be patched
 */
export const patchPreviousElementSibling = (ElementPrototype: any, DescriptorPrototype?: any) => {
  if (!ElementPrototype || ElementPrototype.__previousElementSibling || !ElementPrototype.previousElementSibling)
    return;

  const descriptor = Object.getOwnPropertyDescriptor(
    DescriptorPrototype || Element.prototype,
    'previousElementSibling'
  );
  // MockNode won't have these
  if (descriptor) Object.defineProperty(ElementPrototype, '__previousElementSibling', descriptor);
  else {
    ElementPrototype.__previousElementSibling = ElementPrototype.previousSiblingElement || true;
  }

  ElementPrototype;
  Object.defineProperty(ElementPrototype, 'previousElementSibling', {
    get: function () {
      const parentNodes = this['s-ol']?.parentNode.children;
      const index = parentNodes?.indexOf(this);
      if (parentNodes && index > -1) {
        return parentNodes[index - 1];
      }
      return this.__previousElementSibling;
    },
  });
};

/**
 * Patches removal methods (`remove`, `removeChild`)
 * of a 'slotted' node within a non-shadow component.
 * @param NodePrototype the slotted node to be patched
 */
export const patchRemoval = (NodePrototype: any) => {
  // In-order to decide when a slot's fallback content should show,
  // we need to track when added nodes are removed.
  // So, every node that gets added using patched methods,
  // get patched in-turn to call this method.

  if (!NodePrototype || NodePrototype.__remove) return;

  patchRemoveChild(NodePrototype.parentNode);
  patchRemove(NodePrototype.parentNode);
};

/**
 * Patches the `remove` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
export const patchRemove = (NodePrototype: any) => {
  if (!NodePrototype || NodePrototype.__remove) return;

  NodePrototype.__remove = NodePrototype.remove || true;
  patchRemoveChild(NodePrototype.parentNode);

  NodePrototype.remove = function (this: Element) {
    if (this.parentNode) {
      return this.parentNode.removeChild(this);
    }
    return (this as any).__remove();
  };
};

/**
 * Patches the `removeChild` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchRemoveChild = (ElementPrototype: any) => {
  if (!ElementPrototype || ElementPrototype.__removeChild) return;

  ElementPrototype.__removeChild = ElementPrototype.removeChild;
  ElementPrototype.removeChild = function (this: d.RenderNode, toRemove: d.RenderNode) {
    if (toRemove && typeof toRemove['s-sn'] !== 'undefined') {
      const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, toRemove['s-sn']);
      (toRemove.parentElement as PatchedNode).__removeChild(toRemove);

      if (slotNode && slotNode['s-hsf']) {
        updateFallbackSlotVisibility(slotNode.parentElement);
      }
      return;
    }
    return (this as any).__removeChild(toRemove);
  };
};

////// Utils

/**
 * Creates an empty text node to act as a forwarding address to a slotted node:
 * 1) When non-shadow components re-render, they need a place to temporarily put 'lightDOM' elements.
 * 2) Patched dom methods and accessors use this node to calculate what 'lightDOM' nodes are in the host.
 * @param newChild - A node that's going to be added to the component
 * @param slotNode - The slot node that the node will be added to
 */
export const addSlotRelocateNode = (newChild: d.RenderNode, slotNode: d.RenderNode, order?: number) => {
  if (newChild['s-ol'] && newChild['s-ol'].isConnected) return;

  const slottedNodeLocation: d.RenderNode = document.createTextNode('') as any;
  slottedNodeLocation['s-nr'] = newChild;

  if (slotNode['s-cr'] && slotNode['s-cr'].parentNode) {
    const parent = slotNode['s-cr'].parentNode as PatchedNode;
    const appendChild = parent.__appendChild || parent.appendChild;

    if (typeof order !== 'undefined') {
      slottedNodeLocation['s-oo'] = order;
      const childNodes = (parent.__childNodes || parent.childNodes) as NodeListOf<d.RenderNode>;
      const slotRelocateNodes: d.RenderNode[] = [slottedNodeLocation];
      childNodes.forEach((n) => {
        if (n['s-nr']) slotRelocateNodes.push(n);
      });
      slotRelocateNodes.sort((a, b) => {
        if (!a['s-oo'] || a['s-oo'] < b['s-oo']) return -1;
        else if (!b['s-oo'] || b['s-oo'] < a['s-oo']) return 1;
        return 0;
      });
      slotRelocateNodes.forEach((n) => appendChild.call(slotNode['s-cr'].parentNode, n));
    } else {
      appendChild.call(slotNode['s-cr'].parentNode, slottedNodeLocation);
    }
  }

  newChild['s-ol'] = slottedNodeLocation;
};

/**
 * Find the slot name of a given node
 * @param node
 * @returns the node's slot name
 */
const getSlotName = (node: d.RenderNode) =>
  node['s-sn'] ||
  (node.nodeType === NODE_TYPE.ElementNode && (node as Element).getAttribute('slot')) ||
  node.slot ||
  '';

/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */
const getHostSlotNode = (childNodes: NodeListOf<ChildNode>, slotName: string): d.RenderNode | null => {
  let i = 0;
  let childNode: d.RenderNode | null;
  if (!childNodes) return null;

  for (; i < childNodes.length; i++) {
    childNode = childNodes[i] as d.RenderNode;
    if (childNode['s-sr'] && childNode['s-sn'] === slotName) {
      return childNode;
    }
    childNode = getHostSlotNode(childNode.childNodes, slotName);
    if (childNode) {
      return childNode;
    }
  }
  return null;
};

/**
 * Get all nodes currently assigned to any given slot node
 * @param slotNode - the slot node to check
 * @returns - all child node 'within' the checked slot node
 */
const getHostSlotChildNodes = (slotNode: d.RenderNode) => {
  const childNodes: d.RenderNode[] = [slotNode];
  const slotName = slotNode['s-sn'] || '';

  while ((slotNode = slotNode.nextSibling as any) && slotNode['s-sn'] === slotName) {
    childNodes.push(slotNode as any);
  }
  return childNodes;
};
