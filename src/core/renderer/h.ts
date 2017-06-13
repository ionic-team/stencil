/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Ionic's vdom
 */

import { VNode as VNodeObj } from './vnode';
import { VNode, VNodeProdData } from '../../util/interfaces';

const stack: any[] = [];


export function h(nodeName: string, vnodeData: VNodeProdData): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: string): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: number): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: any[]): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: VNode): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: string, childb: string): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: VNode, childb: VNode): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, child?: any) {
  let children: any[], lastSimple: boolean, simple: boolean, i: number;

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i]);
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--; ) {
        stack.push(child[i]);
      }

    } else {
      if (typeof child === 'boolean') child = null;

      if ((simple = typeof nodeName !== 'function')) {
        if (child == null) child = '';
        else if (typeof child === 'number') child = String(child);
        else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        (<VNode>children[children.length - 1]).vtext += child;

      } else if (children === undefined) {
        children = [simple ? t(child) : child];

      } else {
        children.push(simple ? t(child) : child);
      }

      lastSimple = simple;
    }
  }

  let vnode = new VNodeObj();
  vnode.vtag = nodeName;
  vnode.vchildren = children;

  if (vnodeData !== 0) {
    vnode.vattrs = vnodeData.a;
    vnode.vprops = vnodeData.p;
    vnode.vclass = vnodeData.c;
    vnode.vstyle = vnodeData.s;
    vnode.vlisteners = vnodeData.o;
    vnode.vkey = vnodeData.k;
    vnode.vnamespace = vnodeData.n;
  }

  return vnode;
}


export function t(textValue: any) {
  let v = new VNodeObj();
  v.vtext = textValue;
  return v;
}
