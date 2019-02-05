import * as d from '@declarations';
import { NODE_TYPE } from '@utils';


export function toVNode(node: Node): d.VNode {
  if (node.nodeType === NODE_TYPE.TextNode || node.nodeType === NODE_TYPE.ElementNode) {

    const vnode: d.VNode = {};
    vnode.elm = node as any;

    if (node.nodeType === NODE_TYPE.ElementNode) {
      // element node
      vnode.vtag = node.nodeName.toLowerCase();

      const childNodes = node.childNodes;
      let childVnode: d.VNode;

      for (let i = 0, l = childNodes.length; i < l; i++) {
        childVnode = toVNode(childNodes[i]);
        if (childVnode) {
          (vnode.vchildren = vnode.vchildren || []).push(childVnode);
        }
      }

    } else {
      // text node
      vnode.vtext = node.textContent;
    }

    return vnode;
  }

  return null;
}
