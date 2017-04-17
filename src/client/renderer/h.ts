import { vnode } from './vnode';
import { VNode, VNodeData } from '../../util/interfaces';
import { isArray, isStringOrNumber } from '../../util/helpers';


function addNS(data: any, children: Array<VNode> | undefined, sel: string | undefined): void {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      let childData = children[i].vdata;
      if (childData !== undefined) {
        addNS(childData, (children[i] as VNode).vchildren as Array<VNode>, children[i].sel);
      }
    }
  }
}

export function h(sel: string): VNode;
export function h(sel: Node, data: VNodeData): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, text: string): VNode;
export function h(sel: string, children: Array<VNode>): VNode;
export function h(sel: string, data: VNodeData, text: string): VNode;
export function h(sel: string, data: VNodeData, children: Array<VNode|string>): VNode;
export function h(sel: string, data: VNodeData, children: VNode): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}, children: any, text: any, i: number;
  var elm: HTMLElement = undefined;

  if (sel.nodeType) {
    elm = sel;
  }

  if (c !== undefined) {
    data = b;
    if (isArray(c)) { children = c; }
    else if (isStringOrNumber(c)) { text = c; }
    else if (c && c.sel) { children = [c]; }
  } else if (b !== undefined) {
    if (isArray(b)) { children = b; }
    else if (isStringOrNumber(b)) { text = b; }
    else if (b && b.sel) { children = [b]; }
    else { data = b; }
  }
  if (isArray(children)) {
    for (i = 0; i < children.length; ++i) {
      if (isStringOrNumber(children[i])) children[i] = (vnode as any)(undefined, undefined, undefined, children[i]);
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, elm);
};
export default h;
