import { BUILD } from '@app-data';
import { getHostRef, plt, supportsShadow } from '@platform';
import { CMP_FLAGS, HOST_FLAGS, NODE_TYPES } from '@utils/constants';

import type * as d from '../declarations';
import { PLATFORM_FLAGS } from './runtime-constants';
import { insertBefore, updateFallbackSlotVisibility } from './vdom/vdom-render';

export const patchPseudoShadowDom = (
  hostElementPrototype: HTMLElement,
  descriptorPrototype: d.ComponentRuntimeMeta,
) => {
  patchCloneNode(hostElementPrototype);
  patchSlotAppendChild(hostElementPrototype);
  patchSlotAppend(hostElementPrototype);
  patchSlotPrepend(hostElementPrototype);
  patchSlotInsertAdjacentElement(hostElementPrototype);
  patchSlotInsertAdjacentHTML(hostElementPrototype);
  patchSlotInsertAdjacentText(hostElementPrototype);
  patchTextContent(hostElementPrototype);
  patchChildSlotNodes(hostElementPrototype, descriptorPrototype);
  patchSlotRemoveChild(hostElementPrototype);
};

export const patchCloneNode = (HostElementPrototype: HTMLElement) => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function (deep?: boolean) {
    const srcNode = this;
    const isShadowDom = BUILD.shadowDom ? srcNode.shadowRoot && supportsShadow : false;
    const clonedNode = orgCloneNode.call(srcNode, isShadowDom ? deep : false) as Node;
    if (BUILD.slot && !isShadowDom && deep) {
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
        's-rf',
        's-scs',
      ];

      for (; i < srcNode.childNodes.length; i++) {
        slotted = (srcNode.childNodes[i] as any)['s-nr'];
        nonStencilNode = stencilPrivates.every((privateField) => !(srcNode.childNodes[i] as any)[privateField]);
        if (slotted) {
          if (BUILD.appendChildSlotFix && (clonedNode as any).__appendChild) {
            (clonedNode as any).__appendChild(slotted.cloneNode(true));
          } else {
            clonedNode.appendChild(slotted.cloneNode(true));
          }
        }
        if (nonStencilNode) {
          clonedNode.appendChild((srcNode.childNodes[i] as any).cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

/**
 * Patches the `appendChild` method on a `scoped` Stencil component.
 * The patch will attempt to find a slot with the same name as the node being appended
 * and insert it into the slot reference if found. Otherwise, it falls-back to the original
 * `appendChild` method.
 *
 * @param HostElementPrototype The Stencil component to be patched
 */
export const patchSlotAppendChild = (HostElementPrototype: any) => {
  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function (this: d.RenderNode, newChild: d.RenderNode) {
    const slotName = (newChild['s-sn'] = getSlotName(newChild));
    const slotNode = getHostSlotNode(this.childNodes, slotName, this.tagName);
    if (slotNode) {
      const slotPlaceholder: d.RenderNode = document.createTextNode('') as any;
      slotPlaceholder['s-nr'] = newChild;
      (slotNode['s-cr'].parentNode as any).__appendChild(slotPlaceholder);
      newChild['s-ol'] = slotPlaceholder;
      newChild['s-sh'] = slotNode['s-hn'];

      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];
      const insertedNode = insertBefore(appendAfter.parentNode, newChild, appendAfter.nextSibling);

      // Check if there is fallback content that should be hidden
      updateFallbackSlotVisibility(this);

      return insertedNode;
    }
    return (this as any).__appendChild(newChild);
  };
};

/**
 * Patches the `removeChild` method on a `scoped` Stencil component.
 * This patch attempts to remove the specified node from a slot reference
 * if the slot exists. Otherwise, it falls-back to the original `removeChild` method.
 *
 * @param ElementPrototype The Stencil component to be patched
 */
const patchSlotRemoveChild = (ElementPrototype: any) => {
  ElementPrototype.__removeChild = ElementPrototype.removeChild;
  ElementPrototype.removeChild = function (this: d.RenderNode, toRemove: d.RenderNode) {
    if (toRemove && typeof toRemove['s-sn'] !== 'undefined') {
      const slotNode = getHostSlotNode(this.childNodes, toRemove['s-sn'], this.tagName);
      if (slotNode) {
        // Get all slot content
        const slotChildNodes = getHostSlotChildNodes(slotNode, toRemove['s-sn']);
        // See if any of the slotted content matches the node to remove
        const existingNode = slotChildNodes.find((n) => n === toRemove);

        if (existingNode) {
          existingNode.remove();
          // Check if there is fallback content that should be displayed if that
          // was the last node in the slot
          updateFallbackSlotVisibility(this);
          return;
        }
      }
    }
    return (this as any).__removeChild(toRemove);
  };
};

/**
 * Patches the `prepend` method for a slotted node inside a scoped component.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export const patchSlotPrepend = (HostElementPrototype: HTMLElement) => {
  const originalPrepend = HostElementPrototype.prepend;

  HostElementPrototype.prepend = function (this: d.HostElement, ...newChildren: (d.RenderNode | string)[]) {
    newChildren.forEach((newChild: d.RenderNode | string) => {
      if (typeof newChild === 'string') {
        newChild = this.ownerDocument.createTextNode(newChild) as unknown as d.RenderNode;
      }
      const slotName = (newChild['s-sn'] = getSlotName(newChild));
      const slotNode = getHostSlotNode(this.childNodes, slotName, this.tagName);
      if (slotNode) {
        const slotPlaceholder: d.RenderNode = document.createTextNode('') as any;
        slotPlaceholder['s-nr'] = newChild;
        (slotNode['s-cr'].parentNode as any).__appendChild(slotPlaceholder);
        newChild['s-ol'] = slotPlaceholder;
        newChild['s-sh'] = slotNode['s-hn'];

        const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
        const appendAfter = slotChildNodes[0];
        return insertBefore(appendAfter.parentNode, newChild, appendAfter.nextSibling);
      }

      if (newChild.nodeType === 1 && !!newChild.getAttribute('slot')) {
        newChild.hidden = true;
      }

      return originalPrepend.call(this, newChild);
    });
  };
};

/**
 * Patches the `append` method for a slotted node inside a scoped component. The patched method uses
 * `appendChild` under-the-hood while creating text nodes for any new children that passed as bare strings.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export const patchSlotAppend = (HostElementPrototype: HTMLElement) => {
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
 * Patches the `insertAdjacentHTML` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the element
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export const patchSlotInsertAdjacentHTML = (HostElementPrototype: HTMLElement) => {
  const originalInsertAdjacentHtml = HostElementPrototype.insertAdjacentHTML;

  HostElementPrototype.insertAdjacentHTML = function (this: d.HostElement, position: InsertPosition, text: string) {
    if (position !== 'afterbegin' && position !== 'beforeend') {
      return originalInsertAdjacentHtml.call(this, position, text);
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
 * Patches the `insertAdjacentText` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the text node
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export const patchSlotInsertAdjacentText = (HostElementPrototype: HTMLElement) => {
  HostElementPrototype.insertAdjacentText = function (this: d.HostElement, position: InsertPosition, text: string) {
    this.insertAdjacentHTML(position, text);
  };
};

/**
 * Patches the `insertAdjacentElement` method for a slotted node inside a scoped component. Specifically,
 * we only need to patch the behavior for the specific `beforeend` and `afterbegin` positions so the element
 * gets inserted into the DOM in the correct location.
 *
 * @param HostElementPrototype the `Element` to be patched
 */
export const patchSlotInsertAdjacentElement = (HostElementPrototype: HTMLElement) => {
  const originalInsertAdjacentElement = HostElementPrototype.insertAdjacentElement;

  HostElementPrototype.insertAdjacentElement = function (
    this: d.HostElement,
    position: InsertPosition,
    element: d.RenderNode,
  ): Element {
    if (position !== 'afterbegin' && position !== 'beforeend') {
      return originalInsertAdjacentElement.call(this, position, element);
    }
    if (position === 'afterbegin') {
      this.prepend(element);
      return element;
    } else if (position === 'beforeend') {
      this.append(element);
      return element;
    }
    return element;
  };
};

/**
 * Patches the text content of an unnamed slotted node inside a scoped component
 * @param hostElementPrototype the `Element` to be patched
 */
export const patchTextContent = (hostElementPrototype: HTMLElement): void => {
  const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');

  Object.defineProperty(hostElementPrototype, '__textContent', descriptor);

  if (BUILD.experimentalScopedSlotChanges) {
    // Patch `textContent` to mimic shadow root behavior
    Object.defineProperty(hostElementPrototype, 'textContent', {
      // To mimic shadow root behavior, we need to return the text content of all
      // nodes in a slot reference node
      get(): string | null {
        const slotRefNodes = getAllChildSlotNodes(this.childNodes);

        const textContent = slotRefNodes
          .map((node) => {
            const text = [];

            // Need to get the text content of all nodes in the slot reference node
            let slotContent = node.nextSibling as d.RenderNode | null;
            while (slotContent && slotContent['s-sn'] === node['s-sn']) {
              if (slotContent.nodeType === NODE_TYPES.TEXT_NODE || slotContent.nodeType === NODE_TYPES.ELEMENT_NODE) {
                text.push(slotContent.textContent?.trim() ?? '');
              }
              slotContent = slotContent.nextSibling as d.RenderNode | null;
            }

            return text.filter((ref) => ref !== '').join(' ');
          })
          .filter((text) => text !== '')
          .join(' ');

        // Pad the string to return
        return ' ' + textContent + ' ';
      },

      // To mimic shadow root behavior, we need to overwrite all nodes in a slot
      // reference node. If a default slot reference node exists, the text content will be
      // placed there. Otherwise, the new text node will be hidden
      set(value: string | null) {
        const slotRefNodes = getAllChildSlotNodes(this.childNodes);

        slotRefNodes.forEach((node) => {
          // Remove the existing content of the slot
          let slotContent = node.nextSibling as d.RenderNode | null;
          while (slotContent && slotContent['s-sn'] === node['s-sn']) {
            const tmp = slotContent;
            slotContent = slotContent.nextSibling as d.RenderNode | null;
            tmp.remove();
          }

          // If this is a default slot, add the text node in the slot location.
          // Otherwise, destroy the slot reference node
          if (node['s-sn'] === '') {
            const textNode = this.ownerDocument.createTextNode(value);
            textNode['s-sn'] = '';
            insertBefore(node.parentElement, textNode, node.nextSibling);
          } else {
            node.remove();
          }
        });
      },
    });
  } else {
    Object.defineProperty(hostElementPrototype, 'textContent', {
      get(): string | null {
        // get the 'default slot', which would be the first slot in a shadow tree (if we were using one), whose name is
        // the empty string
        const slotNode = getHostSlotNode(this.childNodes, '', this.tagName);
        // when a slot node is found, the textContent _may_ be found in the next sibling (text) node, depending on how
        // nodes were reordered during the vdom render. first try to get the text content from the sibling.
        if (slotNode?.nextSibling?.nodeType === NODE_TYPES.TEXT_NODE) {
          return slotNode.nextSibling.textContent;
        } else if (slotNode) {
          return slotNode.textContent;
        } else {
          // fallback to the original implementation
          return this.__textContent;
        }
      },

      set(value: string | null) {
        // get the 'default slot', which would be the first slot in a shadow tree (if we were using one), whose name is
        // the empty string
        const slotNode = getHostSlotNode(this.childNodes, '', this.tagName);
        // when a slot node is found, the textContent _may_ need to be placed in the next sibling (text) node,
        // depending on how nodes were reordered during the vdom render. first try to set the text content on the
        // sibling.
        if (slotNode?.nextSibling?.nodeType === NODE_TYPES.TEXT_NODE) {
          slotNode.nextSibling.textContent = value;
        } else if (slotNode) {
          slotNode.textContent = value;
        } else {
          // we couldn't find a slot, but that doesn't mean that there isn't one. if this check ran before the DOM
          // loaded, we could have missed it. check for a content reference element on the scoped component and insert
          // it there
          this.__textContent = value;
          const contentRefElm = this['s-cr'];
          if (contentRefElm) {
            insertBefore(this, contentRefElm, this.firstChild);
          }
        }
      },
    });
  }
};

export const patchChildSlotNodes = (elm: HTMLElement, cmpMeta: d.ComponentRuntimeMeta) => {
  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }
  // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
  if (cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim) {
    const childNodesFn = (elm as any).__lookupGetter__('childNodes');

    Object.defineProperty(elm, 'children', {
      get() {
        return this.childNodes.map((n: any) => n.nodeType === 1);
      },
    });

    Object.defineProperty(elm, 'childElementCount', {
      get() {
        return elm.children.length;
      },
    });
    
    Object.defineProperty(elm, 'firstChild', {
      get() {
        return this.childNodes[0];
      },
    });

    Object.defineProperty(elm, 'lastChild', {
      get() {
        return this.childNodes[this.childNodes.length - 1];
      },
    });

    Object.defineProperty(elm, 'childNodes', {
      get() {
        const childNodes = childNodesFn.call(this) as NodeListOf<d.RenderNode>;
        if (
          (plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0 &&
          getHostRef(this).$flags$ & HOST_FLAGS.hasRendered
        ) {
          const result = new FakeNodeList();
          for (let i = 0; i < childNodes.length; i++) {
            const slot = childNodes[i]['s-nr'];
            if (slot) {
              result.push(slot);
            }
          }
          return result;
        }
        return FakeNodeList.from(childNodes);
      },
    });
  }
};

/**
 * Patches sibling accessors of a 'slotted' node within a non-shadow component.
 * Meaning whilst stepping through a non-shadow element's nodes, only the mock 'lightDOM' nodes are returned.
 * Especially relevant when rendering components via SSR... Frameworks will often try to reconcile their 
 * VDOM with the real DOM by stepping through nodes with 'nextSibling' et al.
 * - `nextSibling`
 * - `nextSiblingElement`
 * - `previousSibling`
 * - `previousSiblingElement`
 * @param NodePrototype the slotted node to be patched
 */
export const patchNextPrev = (node: any) => {
  if (!node || (node as any).__nextSibling || !globalThis.Node) return;

  patchNextSibling(node);
  patchPreviousSibling(node);
  patchNextElementSibling(node);
  patchPreviousElementSibling(node);
};

/**
 * Patches the `nextSibling` accessor of a non-shadow slotted node
 * @param node the slotted node to be patched
 * Required during during testing / mock environnement.
 */
const patchNextSibling = (node: Node) => {
  // already been patched? return
  if (!node || (node as any).__nextSibling) return;

  let descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'nextSibling');
  let toOverride = Node.prototype;

  if (!descriptor) {
    // for mock-doc
    descriptor = Object.getOwnPropertyDescriptor(node, 'nextSibling');
    toOverride = node;
  }
  if (descriptor) Object.defineProperty(toOverride, '__nextSibling', descriptor);

  Object.defineProperty(node, 'nextSibling', {
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
 * @param element the slotted element to be patched
 * Required during during testing / mock environnement.
 */
const patchNextElementSibling = (element: HTMLElement) => {
  if (!element || (element as any).__nextElementSibling || !element.nextElementSibling) return;

  let descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'nextElementSibling');
  let toOverride = Node.prototype;

  if (!descriptor) {
    // for mock-doc
    descriptor = Object.getOwnPropertyDescriptor(element, 'nextElementSibling');
    toOverride = element;
  }
  if (descriptor) Object.defineProperty(toOverride, '__nextElementSibling', descriptor);

  Object.defineProperty(element, 'nextElementSibling', {
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
 * @param element the slotted node to be patched
 * Required during during testing / mock environnement.
 */
const patchPreviousSibling = (node: Node) => {
  if (!node || (node as any).__previousSibling) return;

  let descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'previousSibling');
  let toOverride = Node.prototype;

  if (!descriptor) {
    // for mock-doc
    descriptor = Object.getOwnPropertyDescriptor(node, 'previousSibling');
    toOverride = node;
  }
  if (descriptor) Object.defineProperty(toOverride, '__previousSibling', descriptor);

  Object.defineProperty(node, 'previousSibling', {
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
 * @param DescriptorNodePrototype optional. Where to find the OG descriptor for `previousElementSibling`.
 * Required during during testing / mock environnement.
 */
const patchPreviousElementSibling = (element: HTMLElement) => {
  if (!element || (element as any).__previousElementSibling || !element.previousElementSibling)
    return;

  let descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'previousElementSibling');
  let toOverride = Node.prototype;

  if (!descriptor) {
    // for mock-doc
    descriptor = Object.getOwnPropertyDescriptor(element, 'previousElementSibling');
    toOverride = element;
  }
  if (descriptor) Object.defineProperty(toOverride, '__previousElementSibling', descriptor);

  Object.defineProperty(element, 'previousElementSibling', {
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
 * Recursively finds all slot reference nodes ('s-sr') in a series of child nodes.
 *
 * @param childNodes The set of child nodes to search for slot reference nodes.
 * @returns An array of slot reference nodes.
 */
const getAllChildSlotNodes = (childNodes: NodeListOf<ChildNode>): d.RenderNode[] => {
  const slotRefNodes = [];

  for (const childNode of Array.from(childNodes) as d.RenderNode[]) {
    if (childNode['s-sr']) {
      slotRefNodes.push(childNode);
    }
    slotRefNodes.push(...getAllChildSlotNodes(childNode.childNodes));
  }

  return slotRefNodes;
};

const getSlotName = (node: d.RenderNode) =>
  node['s-sn'] || (node.nodeType === 1 && (node as Element).getAttribute('slot')) || '';

/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @param hostName the host name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */
const getHostSlotNode = (childNodes: NodeListOf<ChildNode>, slotName: string, hostName: string) => {
  let i = 0;
  let childNode: d.RenderNode;

  for (; i < childNodes.length; i++) {
    childNode = childNodes[i] as any;
    if (childNode['s-sr'] && childNode['s-sn'] === slotName && childNode['s-hn'] === hostName) {
      return childNode;
    }
    childNode = getHostSlotNode(childNode.childNodes, slotName, hostName);
    if (childNode) {
      return childNode;
    }
  }
  return null;
};

const getHostSlotChildNodes = (n: d.RenderNode, slotName: string) => {
  const childNodes: d.RenderNode[] = [n];
  while ((n = n.nextSibling as any) && (n as d.RenderNode)['s-sn'] === slotName) {
    childNodes.push(n as any);
  }
  return childNodes;
};
