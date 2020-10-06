import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { supportsShadowDom } from '@platform';


export const cloneNodeFix = (HostElementPrototype: any) => {
  const orgCloneNode = HostElementPrototype.cloneNode;

  HostElementPrototype.cloneNode = function(deep?: boolean) {
    const srcNode = this;
    const isShadowDom = BUILD.shadowDom ? srcNode.shadowRoot && supportsShadowDom : false;
    const clonedNode = orgCloneNode.call(srcNode, isShadowDom ? deep : false) as Node;
    if (BUILD.slot && !isShadowDom && deep) {
      let i = 0;
      let slotted, nonStencilNode;
      let stencilPrivates = ['s-id', 's-cr', 's-lr', 's-rc', 's-sc', 's-p', 's-cn', 's-sr', 's-sn', 's-hn', 's-ol', 's-nr', 's-si'];
      
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
        if (nonStencilNode){
          clonedNode.appendChild((srcNode.childNodes[i] as any).cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};

export const appendChildSlotFix = (HostElementPrototype: any) => {

  HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
  HostElementPrototype.appendChild = function(this: d.RenderNode, newChild: d.RenderNode) {
    const slotName = newChild['s-sn'] = getSlotName(newChild);
    const slotNode = getHostSlotNode(this, slotName);
    if (slotNode) {
      const slotChildNodes = getHostSlotChildNodes(slotNode, slotName);
      const appendAfter = slotChildNodes[slotChildNodes.length - 1];
      return appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
    }
    return (this as any).__appendChild(newChild);
  };

};

const getSlotName = (node: d.RenderNode) =>
  (node['s-sn']) ||
  (node.nodeType === 1 && (node as Element).getAttribute('slot')) || '';

const getHostSlotNode = (elm: d.RenderNode, slotName: string) => {
  let childNodes = elm.childNodes as any as d.RenderNode[];
  let i = 0;
  let childNode: d.RenderNode;

  for (; i < childNodes.length; i++) {
    childNode = childNodes[i];
    if (childNode['s-sr'] && childNode['s-sn'] === slotName) {
      return childNode;
    }
    childNode = getHostSlotNode(childNode, slotName);
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
