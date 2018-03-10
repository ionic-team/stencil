import { DomApi } from '../../declarations';
import { VNode } from './h';


export function toVNode(domApi: DomApi, node: Node): VNode {
  const nodeType = domApi.$nodeType(node);

  if (nodeType === 1 || nodeType === 3) {

    const vnode: VNode = new VNode();
    vnode.elm = node;

    if (nodeType === 1) {
      // element node
      vnode.vtag = domApi.$tagName(node);

      const childNodes = domApi.$childNodes(node);
      let childVnode: VNode;

      for (let i = 0, l = childNodes.length; i < l; i++) {
        childVnode = toVNode(domApi, childNodes[i]);
        if (childVnode) {
          (vnode.vchildren = vnode.vchildren || []).push(childVnode);
        }
      }

    } else {
      // text node
      vnode.vtext = domApi.$getTextContent(node);
    }

    return vnode;
  }

  return null;
}
