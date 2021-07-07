import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';
import { PLATFORM_FLAGS } from './runtime-constants';
import { plt, supportsShadow, getHostRef } from '@platform';

export const patchCloneNode = (HostElementPrototype: any) => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function (deep?: boolean) {
    const srcNode = this;
    const isShadowDom = BUILD.shadowDom ? srcNode.shadowRoot && supportsShadow : false;
    const clonedNode = orgCloneNode.call(srcNode, isShadowDom ? deep : false) as Node;
    if (BUILD.slot && !isShadowDom && deep) {
      let i = 0;
      let slotted, nonStencilNode;
      let stencilPrivates = [
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
        nonStencilNode = stencilPrivates.every(privateField => !(srcNode.childNodes[i] as any)[privateField]);
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

export const patchChildSlotNodes = (elm: any, cmpMeta: d.ComponentRuntimeMeta) => {
  class FakeNodeList extends Array {
    item(n: number) {
      return this[n];
    }
  }
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
