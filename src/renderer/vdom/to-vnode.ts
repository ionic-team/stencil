import * as d from '@declarations';


export function toVNode(domApi: d.DomApi, node: Node): d.VNode {
  const nodeType = domApi.$nodeType(node);

  if (nodeType === 1 || nodeType === 3) {

    const vnode: d.VNode = {};
    vnode.elm = node;

    if (nodeType === 1) {
      // element node
      vnode.vtag = domApi.$tagName(node);

      const childNodes = domApi.$childNodes(node);
      let childVnode: d.VNode;

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
