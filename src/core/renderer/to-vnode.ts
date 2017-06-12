import { DomApi, VNode } from '../../util/interfaces';


export function toVNode(domApi: DomApi, node: Node): VNode {
  const nodeType = domApi.$nodeType(node);
  if (nodeType === 1 || nodeType === 3) {
    const vnode: VNode = {
      isVnode: true,
      n: node
    };

    if (nodeType === 1) {
      // element node
      vnode.e = domApi.$tagName(node).toLowerCase();

      const childNodes = domApi.$childNodes(node);
      let childVnode: VNode;

      for (let i = 0, l = childNodes.length; i < l; i++) {
        childVnode = toVNode(domApi, childNodes[i]);
        if (childVnode) {
          (vnode.h = vnode.h || []).push(childVnode);
        }
      }

    } else {
      // text node
      vnode.t = domApi.$getTextContent(node);
    }

    return vnode;
  }

  return null;
}
