import { DomApi, VNode } from '../../util/interfaces';


export function vnode(sel: string | undefined,
                      data: any | undefined,
                      children: Array<VNode | string> | undefined,
                      text: string | undefined,
                      elm: Element | Text | undefined): VNode {
  let key = data === undefined ? undefined : data.key;
  return {sel: sel, vdata: data, vchildren: children,
          vtext: text, elm: elm, vkey: key};
}


export function toVNode(node: Node, api: DomApi): VNode {
  let text: string;
  if (api.$isElement(node)) {
    const id = (<Element>node).id ? '#' + (<Element>node).id : '';
    const cn = api.$getAttribute(node, 'class');
    const c = cn ? '.' + cn.split(' ').join('.') : '';
    const sel = api.$tagName(node).toLowerCase() + id + c;
    const attrs: any = {};
    const children: Array<VNode> = [];
    let name: string;
    let i: number, n: number;
    const elmAttrs = node.attributes;
    const elmChildren = node.childNodes;
    for (i = 0, n = elmAttrs.length; i < n; i++) {
      name = elmAttrs[i].nodeName;
      if (name !== 'id' && name !== 'class') {
        attrs[name] = elmAttrs[i].nodeValue;
      }
    }
    for (i = 0, n = elmChildren.length; i < n; i++) {
      children.push(toVNode(elmChildren[i], api));
    }
    return vnode(sel, {attrs}, children, undefined, (<Element>node));
  } else if (api.$isText(node)) {
    text = api.$getTextContent(node) as string;
    return vnode(undefined, undefined, undefined, text, (<Text>node));
  } else if (api.$isComment(node)) {
    text = api.$getTextContent(node) as string;
    return vnode('!', {}, [], text, node as any);
  } else {
    return vnode('', {}, [], undefined, undefined);
  }
}
