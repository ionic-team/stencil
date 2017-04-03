import { VNode } from '../utils/interfaces';


export function vnode(sel: string | undefined,
                      data: any | undefined,
                      children: Array<VNode | string> | undefined,
                      text: string | undefined,
                      elm: Element | Text | undefined): VNode {
  let key = data === undefined ? undefined : data.key;
  return {sel: sel, vdata: data, vchildren: children,
          vtext: text, elm: elm, vkey: key};
}

