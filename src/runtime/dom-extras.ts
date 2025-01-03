import { BUILD } from '@app-data';
import { getHostRef, plt, supportsShadow } from '@platform';
import { HOST_FLAGS } from '@utils/constants';

import type * as d from '../declarations';
import { PLATFORM_FLAGS } from './runtime-constants';
import {
  addSlotRelocateNode,
  getHostSlotChildNodes,
  getHostSlotNodes,
  getSlotName,
  getSlottedChildNodes,
  updateFallbackSlotVisibility,
} from './slot-polyfill-utils';
import { insertBefore } from './vdom/vdom-render';

export const patchPseudoShadowDom = (hostElementPrototype: HTMLElement) => {
  patchCloneNode(hostElementPrototype);
  patchSlotAppendChild(hostElementPrototype);
  patchSlotAppend(hostElementPrototype);
  patchSlotPrepend(hostElementPrototype);
  patchSlotInsertAdjacentElement(hostElementPrototype);
  patchSlotInsertAdjacentHTML(hostElementPrototype);
  patchSlotInsertAdjacentText(hostElementPrototype);
  patchTextContent(hostElementPrototype);
  patchChildSlotNodes(hostElementPrototype);
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
      const childNodes = (this as any).__childNodes || this.childNodes;

      for (; i < childNodes.length; i++) {
        slotted = (childNodes[i] as any)['s-nr'];
        nonStencilNode = stencilPrivates.every((privateField) => !(childNodes[i] as any)[privateField]);
        if (slotted) {
          if (BUILD.appendChildSlotFix && (clonedNode as any).__appendChild) {
            (clonedNode as any).__appendChild(slotted.cloneNode(true));
          } else {
            clonedNode.appendChild(slotted.cloneNode(true));
          }
        }
        if (nonStencilNode) {
          clonedNode.appendChild((childNodes[i] as any).cloneNode(true));
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
    const slotNode = getHostSlotNodes((this as any).__childNodes || this.childNodes, this.tagName, slotName)[0];
    if (slotNode) {
      addSlotRelocateNode(newChild, slotNode);

      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];
      const insertedNode = insertBefore(appendAfter.parentNode, newChild, appendAfter.nextSibling as d.RenderNode);

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
      const childNodes = (this as any).__childNodes || this.childNodes;
      const slotNode = getHostSlotNodes(childNodes, this.tagName, toRemove['s-sn']);
      if (slotNode && toRemove.isConnected) {
        toRemove.remove();
        // Check if there is fallback content that should be displayed if that
        // was the last node in the slot
        updateFallbackSlotVisibility(this);
        return;
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
  (HostElementPrototype as any).__prepend = HostElementPrototype.prepend;

  HostElementPrototype.prepend = function (this: d.HostElement, ...newChildren: (d.RenderNode | string)[]) {
    newChildren.forEach((newChild: d.RenderNode | string) => {
      if (typeof newChild === 'string') {
        newChild = this.ownerDocument.createTextNode(newChild) as unknown as d.RenderNode;
      }
      const slotName = (newChild['s-sn'] = getSlotName(newChild));
      const childNodes = (this as any).__childNodes || this.childNodes;
      const slotNode = getHostSlotNodes(childNodes, this.tagName, slotName)[0];
      if (slotNode) {
        addSlotRelocateNode(newChild, slotNode, true);
        const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
        const appendAfter = slotChildNodes[0];
        return insertBefore(appendAfter.parentNode, newChild, appendAfter.nextSibling as d.RenderNode);
      }

      if (newChild.nodeType === 1 && !!newChild.getAttribute('slot')) {
        newChild.hidden = true;
      }

      return (HostElementPrototype as any).__prepend(newChild);
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
  (HostElementPrototype as any).__append = HostElementPrototype.append;
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
  let descriptor = globalThis.Node && Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');

  if (!descriptor) {
    // for mock-doc
    descriptor = Object.getOwnPropertyDescriptor(hostElementPrototype, 'textContent');
  }
  if (descriptor) Object.defineProperty(hostElementPrototype, '__textContent', descriptor);

  Object.defineProperty(hostElementPrototype, 'textContent', {
    get: function () {
      let text = '';
      const childNodes = this.__childNodes ? this.childNodes : getSlottedChildNodes(this.childNodes);
      childNodes.forEach((node: d.RenderNode) => (text += node.textContent || ''));
      return text;
    },
    set: function (value) {
      const childNodes = this.__childNodes ? this.childNodes : getSlottedChildNodes(this.childNodes);
      childNodes.forEach((node: d.RenderNode) => {
        if (node['s-ol']) node['s-ol'].remove();
        node.remove();
      });
      this.insertAdjacentHTML('beforeend', value);
    },
  });
};

export const patchChildSlotNodes = (elm: HTMLElement) => {
  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }

  let childNodesFn = globalThis.Node && Object.getOwnPropertyDescriptor(Node.prototype, 'childNodes');
  if (!childNodesFn) {
    // for mock-doc
    childNodesFn = Object.getOwnPropertyDescriptor(elm, 'childNodes');
  }
  if (childNodesFn) Object.defineProperty(elm, '__childNodes', childNodesFn);

  let childrenFn = Object.getOwnPropertyDescriptor(Element.prototype, 'children');
  if (!childrenFn) {
    // for mock-doc
    childrenFn = Object.getOwnPropertyDescriptor(elm, 'children');
  }
  if (childrenFn) Object.defineProperty(elm, '__children', childrenFn);

  Object.defineProperty(elm, 'children', {
    get() {
      return this.childNodes.filter((n: any) => n.nodeType === 1);
    },
  });

  Object.defineProperty(elm, 'childElementCount', {
    get() {
      return this.children.length;
    },
  });

  if (!childNodesFn) return;

  Object.defineProperty(elm, 'childNodes', {
    get() {
      if (
        !plt.$flags$ ||
        !getHostRef(this)?.$flags$ ||
        ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0 && getHostRef(this)?.$flags$ & HOST_FLAGS.hasRendered)
      ) {
        const result = new FakeNodeList();
        const nodes = getSlottedChildNodes(this.__childNodes);
        result.push(...nodes);
        return result;
      }
      return FakeNodeList.from(this.__childNodes);
    },
  });
};
