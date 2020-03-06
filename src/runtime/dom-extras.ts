import * as d from '../declarations';
import { BUILD } from '@app-data';
import { CMP_FLAGS } from '@utils';
import { PLATFORM_FLAGS } from './runtime-constants';
import { plt, supportsShadow } from '@platform';


export const patchCloneNode = (HostElementPrototype: any) => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function(deep?: boolean) {
    const srcNode = this;
    const isShadowDom = BUILD.shadowDom ? srcNode.shadowRoot && supportsShadow : false;
    const clonedNode = orgCloneNode.call(srcNode, isShadowDom ? deep : false) as Node;
    if (BUILD.slot && !isShadowDom && deep) {
      let i = 0;
      let slotted;
      for (; i < srcNode.childNodes.length; i++) {
        slotted = (srcNode.childNodes[i] as any)['s-nr'];
        if (slotted) {
          if (BUILD.appendChildSlotFix && (clonedNode as any).__appendChild) {
            (clonedNode as any).__appendChild(slotted.cloneNode(true));
          } else {
            clonedNode.appendChild(slotted.cloneNode(true));
          }
        }
      }
    }
    return clonedNode;
  };
};

export const patchSlotAppendChild = (HostElementPrototype: any) => {

  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function(this: d.RenderNode, newChild: d.RenderNode) {
    const slotName = newChild['s-sn'] = getSlotName(newChild);
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
  if (cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim) {
    const childrenFn = elm.__lookupGetter__('children');
    const childNodesFn = elm.__lookupGetter__('childNodes');

    Object.defineProperty(elm, 'children', {
      get() {
        const children = childrenFn.call(this);
        if ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0) {
          const slotNode = getHostSlotNode(children, '');
          if (slotNode && slotNode.parentNode) {
            return slotNode.parentNode.children;
          }
        }
        return children;
      }
    });

    Object.defineProperty(elm, 'childElementCount', {
      get() {
        return elm.children.length;
      }
    });

    Object.defineProperty(elm, 'childNodes', {
      get() {
        const childNodes = childNodesFn.call(this);
        if ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0) {
          const slotNode = getHostSlotNode(childNodes, '');
          if (slotNode && slotNode.parentNode) {
            return slotNode.parentNode.childNodes;
          }
        }
        return childNodes;
      }
    });
  }
};

const getSlotName = (node: d.RenderNode) =>
  (node['s-sn']) ||
  (node.nodeType === 1 && (node as Element).getAttribute('slot')) || '';

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
