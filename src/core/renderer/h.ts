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

export type PropsType = VNodeProdData | number | string | null;
export type ChildType = VNode | number | string;

export function h(nodeName: string, vnodeData: PropsType, child?: ChildType): VNode;
export function h(nodeName: string, vnodeData: PropsType, ...children: ChildType[]): VNode;
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

  const vnode = new VNodeObj();
  vnode.vtag = nodeName;
  vnode.vchildren = children;

  if (vnodeData) {
    vnode.vattrs = vnodeData;
    vnode.vkey = vnodeData.key;
    vnode.vref = vnodeData.ref;

    // normalize class / classname attributes
    if (vnodeData['className']) {
      vnodeData['class'] = vnodeData['className'];
    }

    if (typeof vnodeData['class'] === 'object') {
      for (let key in vnodeData['class']) {
        if (vnodeData['class'][key]) {
          stack.push(key);
        }
      }

      vnodeData['class'] = stack.join(' ');
      stack.length = 0;
    }
  }

  return vnode;
}

export function t(textValue: any) {
  const vnode = new VNodeObj();
  vnode.vtext = textValue;
  return vnode;
}
