import { BUILD } from '@app-data';
import { getHostRef, plt, supportsShadow } from '@platform';
import { NODE_TYPES } from '@stencil/core/mock-doc';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';

import type * as d from '../declarations';
import { PLATFORM_FLAGS } from './runtime-constants';

export const patchCloneNode = (HostElementPrototype: any) => {
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

export const patchSlotAppendChild = (HostElementPrototype: any) => {
  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function (this: d.RenderNode, newChild: d.RenderNode) {
    const slotName = (newChild['s-sn'] = getSlotName(newChild));
    const slotNode = getHostSlotNode(this.childNodes, slotName);
    if (slotNode) {
      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];
      return appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
    }
    return (this as any).__appendChild(newChild);
  };
};

/**
 * Patches the text content of an unnamed slotted node inside a scoped component
 * @param hostElementPrototype the `Element` to be patched
 * @param cmpMeta component runtime metadata used to determine if the component should be patched or not
 */
export const patchTextContent = (hostElementPrototype: HTMLElement, cmpMeta: d.ComponentRuntimeMeta): void => {
  if (BUILD.scoped && cmpMeta.$flags$ & CMP_FLAGS.scopedCssEncapsulation) {
    const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');

    Object.defineProperty(hostElementPrototype, '__textContent', descriptor);

    Object.defineProperty(hostElementPrototype, 'textContent', {
      get(): string | null {
        // get the 'default slot', which would be the first slot in a shadow tree (if we were using one), whose name is
        // the empty string
        const slotNode = getHostSlotNode(this.childNodes, '');
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
        const slotNode = getHostSlotNode(this.childNodes, '');
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
            this.insertBefore(contentRefElm, this.firstChild);
          }
        }
      },
    });
  }
};

export const patchChildSlotNodes = (elm: any, cmpMeta: d.ComponentRuntimeMeta) => {
  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }
  // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
  if (cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim) {
    const childNodesFn = elm.__lookupGetter__('childNodes');

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

    Object.defineProperty(elm, 'childNodes', {
      get() {
        const childNodes = childNodesFn.call(this);
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

const getSlotName = (node: d.RenderNode) =>
  node['s-sn'] || (node.nodeType === 1 && (node as Element).getAttribute('slot')) || '';

/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */
const getHostSlotNode = (childNodes: NodeListOf<ChildNode>, slotName: string) => {
  let i = 0;
  let childNode: d.RenderNode;

  for (; i < childNodes.length; i++) {
    childNode = childNodes[i] as any;
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
  while ((n = n.nextSibling as any) && (n as d.RenderNode)['s-sn'] === slotName) {
    childNodes.push(n as any);
  }
  return childNodes;
};
