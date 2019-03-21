import * as d from '../../../declarations';
import { NODE_TYPE } from '../../runtime-constants';


export function toVNode(node: Node): d.VNode {
  if (node.nodeType === NODE_TYPE.TextNode || node.nodeType === NODE_TYPE.ElementNode) {

    const vnode: d.VNode = {
      $flags$: 0,
      $elm$: node
    };

    if (node.nodeType === NODE_TYPE.ElementNode) {
      // element node
      vnode.$tag$ = node.nodeName.toLowerCase();

      const childNodes = node.childNodes;
      let childVnode: d.VNode;

      for (let i = 0, l = childNodes.length; i < l; i++) {
        childVnode = toVNode(childNodes[i]);
        if (childVnode) {
          (vnode.$children$ = vnode.$children$ || []).push(childVnode);
        }
      }

    } else {
      // text node
      vnode.$text$ = node.textContent;
    }

    return vnode;
  }

  return null;
}
