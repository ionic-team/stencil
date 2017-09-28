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

export type ChildType = VNode | number | string;

export function h(nodeName: string, vnodeData: null): VNode;
export function h(nodeName: string, vnodeData: null, child: string): VNode;
export function h(nodeName: string, vnodeData: null, child: number): VNode;
export function h(nodeName: string, vnodeData: null, ...children: ChildType[]): VNode;
export function h(nodeName: string, vnodeData: string): VNode;
export function h(nodeName: string, vnodeData: string, child: string): VNode;
export function h(nodeName: string, vnodeData: string, child: number): VNode;
export function h(nodeName: string, vnodeData: string, ...children: ChildType[]): VNode;
export function h(nodeName: string, vnodeData: number): VNode;
export function h(nodeName: string, vnodeData: number, child: string): VNode;
export function h(nodeName: string, vnodeData: number, child: number): VNode;
export function h(nodeName: string, vnodeData: number, ...children: ChildType[]): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, child: string): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, child: number): VNode;
export function h(nodeName: string, vnodeData: VNodeProdData, ...children: ChildType[]): VNode;
export function h(nodeName: any, vnodeData: any, child?: any) {
  var children: any[];
  var lastSimple = false;
  var simple = false;

  for (var i = arguments.length; i-- > 2; ) {
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

  vnodeData = (vnodeData === null) ? undefined : vnodeData;

  let vnode = new VNodeObj();
  vnode.vtag = nodeName;
  vnode.vchildren = children;
  vnode.vattrs = (vnodeData === null) ? undefined : vnodeData;

  if (vnode.vattrs) {
    if (vnode.vattrs.className) {
      vnode.vattrs.class = vnode.vattrs.className;
    }
    if (vnode.vattrs.class && typeof vnode.vattrs.class === 'string') {
      const classList = vnode.vattrs.class.trim().split(/\s+/);
      vnode.vattrs.class = {};

      for (let i = classList.length - 1; i > -1; i -= 1) {
        vnode.vattrs.class[classList[i]] = true;
      }
    }
  }

  return vnode;
}

export function t(textValue: any) {
  const vnode = new VNodeObj();
  vnode.vtext = textValue;
  return vnode;
}
