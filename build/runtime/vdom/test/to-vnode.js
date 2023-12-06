import { newVNode } from '../h';
export function toVNode(node) {
    if (node.nodeType === 3 /* NODE_TYPE.TextNode */) {
        const vnode = newVNode(null, node.textContent);
        vnode.$elm$ = node;
        return vnode;
    }
    else if (node.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        const vnode = newVNode(node.nodeName.toLowerCase(), null);
        vnode.$elm$ = node;
        const childNodes = node.childNodes;
        let childVnode;
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
//# sourceMappingURL=to-vnode.js.map