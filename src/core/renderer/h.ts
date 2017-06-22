/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import { VNode as VNodeObj } from './vnode';
import { VNode, VNodeProdData } from '../../util/interfaces';

const stack: any[] = [];


export function h(nodeName: number, vnodeData: VNodeProdData): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: string): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: number): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: any[]): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: VNode): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: string, childb: string): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, childa: VNode, childb: VNode): VNode;
export function h(nodeName: any, vnodeData: VNodeProdData, child?: any) {
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

  if (vnodeData) {
    // data object was provided
    vnode.vattrs = vnodeData.a;
    vnode.vprops = vnodeData.p;
    vnode.vclass = vnodeData.c;
    vnode.vstyle = vnodeData.s;
    vnode.vlisteners = vnodeData.o;
    vnode.vkey = vnodeData.k;
    vnode.vnamespace = vnodeData.n;

    // x = undefined: always check both data and children
    // x = 0 skip checking only data on update
    // x = 1 skip checking only children on update
    // x = 2 skip checking both data and children on update
    vnode.skipDataOnUpdate = vnodeData.x === 0 || vnodeData.x === 2;
    vnode.skipChildrenOnUpdate = vnodeData.x > 0;

  } else {
    // no data object was provided
    // so no data, so don't both checking data
    vnode.skipDataOnUpdate = true;

    // since no data was provided, than no x was provided
    // if no x was provided then we need to always check children
    // if if there are no children at all, then we know never to check children
    vnode.skipChildrenOnUpdate = (!children || children.length === 0);
  }

  return vnode;
}


export function t(textValue: any) {
  const vnode = new VNodeObj();
  vnode.vtext = textValue;
  return vnode;
}
