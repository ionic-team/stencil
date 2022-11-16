import { BUILD } from '@app-data';
import { updateFallbackSlotVisibility } from './vdom/render-slot-fallback';

import type * as d from '../declarations';

interface PolyfilledNode extends d.HostElement {
  readonly __childNodes: NodeListOf<ChildNode>;
  readonly __children: HTMLCollectionOf<Element>;
  readonly __childElementCount: number;
  __innerHTML: string;
  __innerText: string;
  __textContent: string;
  __append: (...nodes: (Node | string)[]) => void;
  __prepend: (...nodes: (Node | string)[]) => void;
  __appendChild: <T extends Node>(newChild: T) => T;
  __replaceChildren: (...nodes: (Node | string)[]) => void;
  __insertAdjacentElement: (position: InsertPosition, insertedElement: Element) => Element | null;
  __insertAdjacentHTML: (where: InsertPosition, html: string) => void;
  __insertAdjacentText: (where: InsertPosition, text: string) => void;
  __removeChild: (node: ChildNode) => void;
}

/**
 * Polyfills `cloneNode()` for slot polyfilled components ()
 * @param HostElementPrototype the host prototype to polyfill
 */
export const patchCloneNode = (HostElementPrototype: any) => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function (deep?: boolean) {
    const srcNode: PolyfilledNode = this;
    const clonedNode: PolyfilledNode = orgCloneNode.call(srcNode, false);
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

export const patchPseudoShadowDom = (HostElementPrototype: any) => {
  patchChildSlotNodes(HostElementPrototype);
  patchSlotAppendChild(HostElementPrototype);
  patchSlotAppend(HostElementPrototype);
  patchSlotPrepend(HostElementPrototype);
  patchSlotInsertAdjacentHTML(HostElementPrototype);
  patchSlotInsertAdjacentText(HostElementPrototype);
  patchSlotInsertAdjacentElement(HostElementPrototype);
  patchSlotReplaceChildren(HostElementPrototype);
  patchSlotInnerHTML(HostElementPrototype);
  patchSlotInnerText(HostElementPrototype);
  patchTextContent(HostElementPrototype);
  patchNodeRemoveChild(HostElementPrototype);
};

const patchChildSlotNodes = (HostElementPrototype: any) => {
  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }

  const childNodesDesc = Object.getOwnPropertyDescriptor(Node.prototype, 'childNodes');
  if (childNodesDesc) Object.defineProperty(HostElementPrototype, '__childNodes', childNodesDesc);

  let childrenDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'children');
  // on IE it's on HTMLElement.prototype
  if (!childrenDesc) childrenDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'children');
  // MockNode won't have these
  if (childrenDesc) Object.defineProperty(HostElementPrototype, '__children', childrenDesc);

  const childElementCountDesc = Object.getOwnPropertyDescriptor(Element.prototype, 'childElementCount');
  if (childElementCountDesc) Object.defineProperty(HostElementPrototype, '__childElementCount', childElementCountDesc);

  Object.defineProperty(HostElementPrototype, 'children', {
    get() {
      return (this.childNodes as FakeNodeList)
        .map((n: Node) => {
          if (n.nodeType === 1) return n;
          else return null;
        })
        .filter((n) => !!n);
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
        const slot = childNodes[i]['s-nr'];
        if (slot) {
          result.push(slot);
        }
      }
      return result;
    },
  });
};

const patchSlotInnerHTML = (HostElementPrototype: any) => {
  let descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
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
        if (node['s-ol']) node['s-ol'].remove();
        node.remove();
      });
      this.insertAdjacentHTML('beforeend', value);
    },
  });
};

const patchSlotInnerText = (HostElementPrototype: any) => {
  let descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText');
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
 * Patches the text content accessors of a scoped component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchTextContent = (HostElementPrototype: any) => {
  const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
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

export const patchNodeRemove = (ElementPrototype: any) => {
  if (!ElementPrototype || ElementPrototype.__remove) return;

  ElementPrototype.__remove = ElementPrototype.remove || true;
  patchNodeRemoveChild(ElementPrototype.parentNode);

  ElementPrototype.remove = function (this: Element) {
    if (this.parentNode) {
      return this.parentNode.removeChild(this);
    }
    return (this as any).__remove();
  };
};

const patchNodeRemoveChild = (ElementPrototype: any) => {
  if (!ElementPrototype || ElementPrototype.__removeChild) return;

  ElementPrototype.__removeChild = ElementPrototype.removeChild;
  ElementPrototype.removeChild = function (this: d.RenderNode, toRemove: d.RenderNode) {
    if (toRemove && typeof toRemove['s-sn'] !== 'undefined') {
      const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, toRemove['s-sn']);
      (toRemove.parentElement as PolyfilledNode).__removeChild(toRemove);

      if (slotNode && slotNode['s-hsf']) {
        updateFallbackSlotVisibility(this);
      }
      return;
    }
    return (this as any).__removeChild(toRemove);
  };
};

const patchSlotAppendChild = (HostElementPrototype: any) => {
  if (HostElementPrototype.__appendChild) return;

  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function (this: PolyfilledNode, newChild: d.RenderNode) {
    const slotName = (newChild['s-sn'] = getSlotName(newChild));
    const slotNode = getHostSlotNode(this.__childNodes, slotName);

    if (slotNode) {
      const slotPlaceholder: d.RenderNode = document.createTextNode('') as any;
      slotPlaceholder['s-nr'] = newChild;
      if (slotNode['s-cr'] && slotNode['s-cr'].parentNode) {
        (slotNode['s-cr'].parentNode as any).__appendChild(slotPlaceholder);
      }
      newChild['s-ol'] = slotPlaceholder;
      patchNodeRemove(newChild);

      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];

      if (appendAfter.parentNode) {
        appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
      }
      patchNodeRemoveChild(newChild.parentNode);

      if (slotNode['s-hsf']) {
        updateFallbackSlotVisibility(slotNode.parentNode as d.RenderNode);
      }
      return;
    }
    if (newChild.nodeType === 1 && !!newChild.getAttribute('slot') && this.__childNodes) newChild.hidden = true;
    return (this as any).__appendChild(newChild);
  };
};

const patchSlotPrepend = (HostElementPrototype: any) => {
  if (HostElementPrototype.__prepend) return;

  HostElementPrototype.__prepend = HostElementPrototype.prepend;
  HostElementPrototype.prepend = function (this: PolyfilledNode, ...newChildren: (d.RenderNode | string)[]) {
    newChildren.forEach((newChild: d.RenderNode | string) => {
      if (typeof newChild === 'string') {
        newChild = this.ownerDocument.createTextNode(newChild) as unknown as d.RenderNode;
      }

      const slotName = (newChild['s-sn'] = getSlotName(newChild));
      const slotNode = getHostSlotNode(this.__childNodes, slotName);

      if (slotNode) {
        const slotPlaceholder: d.RenderNode = document.createTextNode('') as any;
        slotPlaceholder['s-nr'] = newChild;

        if (slotNode['s-cr'] && slotNode['s-cr'].parentNode) {
          (slotNode['s-cr'].parentNode as any).__appendChild(slotPlaceholder);
        }
        newChild['s-ol'] = slotPlaceholder;
        patchNodeRemove(newChild);

        const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
        const appendAfter = slotChildNodes[0];

        if (appendAfter.parentNode) {
          appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
        }
        patchNodeRemoveChild(newChild.parentNode);

        if (slotNode['s-hsf']) {
          updateFallbackSlotVisibility(slotNode.parentNode as d.RenderNode);
        }
        return;
      }
      if (newChild.nodeType === 1 && !!newChild.getAttribute('slot') && this.__childNodes) newChild.hidden = true;
      return (this as any).__prepend(newChild);
    });
  };
};

const patchSlotAppend = (HostElementPrototype: any) => {
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

const patchSlotReplaceChildren = (HostElementPrototype: any) => {
  if (HostElementPrototype.__replaceChildren) return;

  HostElementPrototype.__replaceChildren = HostElementPrototype.replaceChildren;
  HostElementPrototype.replaceChildren = function (this: PolyfilledNode, ...newChildren: (Node | string)[]) {
    const slotNode = getHostSlotNode(this.__childNodes, '');
    if (slotNode) {
      const slotChildNodes = getHostSlotChildNodes(slotNode, '');
      slotChildNodes.forEach((node) => {
        if (!node['s-sr']) {
          node.remove();
        }
      });
      this.append(...newChildren);
    }
  };
};

const patchSlotInsertAdjacentHTML = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentHTML) return;

  HostElementPrototype.__insertAdjacentHTML = HostElementPrototype.insertAdjacentHTML;
  HostElementPrototype.insertAdjacentHTML = function (this: PolyfilledNode, position: InsertPosition, text: string) {
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

const patchSlotInsertAdjacentText = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentText) return;
  HostElementPrototype.__insertAdjacentText = HostElementPrototype.insertAdjacentText;
  HostElementPrototype.insertAdjacentText = function (this: PolyfilledNode, position: InsertPosition, text: string) {
    this.insertAdjacentHTML(position, text);
  };
};

const patchSlotInsertAdjacentElement = (HostElementPrototype: any) => {
  if (HostElementPrototype.__insertAdjacentElement) return;
  HostElementPrototype.__insertAdjacentElement = HostElementPrototype.insertAdjacentElement;
  HostElementPrototype.insertAdjacentElement = function (
    this: PolyfilledNode,
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

const getSlotName = (node: d.RenderNode) =>
  node['s-sn'] || (node.nodeType === 1 && (node as Element).getAttribute('slot')) || node.slot || '';

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

const getHostSlotChildNodes = (n: d.RenderNode, slotName: string) => {
  const childNodes: d.RenderNode[] = [n];
  while ((n = n.nextSibling as any) && n['s-sn'] === slotName) {
    childNodes.push(n as any);
  }
  return childNodes;
};
