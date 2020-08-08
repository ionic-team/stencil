import type * as d from '../../../declarations';
import { NODE_TYPE } from '../../runtime-constants';
import { newVNode } from '../h';

export function toVNode(node: Node): d.VNode {
  if (node.nodeType === NODE_TYPE.TextNode) {
    const vnode: d.VNode = newVNode(null, node.textContent);
    vnode.$elm$ = node;
    return vnode;
  } else if (node.nodeType === NODE_TYPE.ElementNode) {
    const vnode: d.VNode = newVNode(node.nodeName.toLowerCase(), null);
    vnode.$elm$ = node;

    const childNodes = node.childNodes;
    let childVnode: d.VNode;

    for (let i = 0, l = childNodes.length; i < l; i++) {
      childVnode = toVNode(childNodes[i]);
      if (childVnode) {
        (vnode.$children$ = vnode.$children$ || []).push(childVnode);
      }
    }
    return vnode;
  }

  return null;
}
