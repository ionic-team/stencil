/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import * as d from '../../declarations';
import { BUILD } from '@build-conditionals';

const stack: any[] = [];

export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
export function h(nodeName: any, vnodeData: any) {
  let children: any[] = null;
  let lastSimple = false;
  let simple = false;
  let i = arguments.length;
  let vkey: any;
  let vname: string;

  for (; i-- > 2;) {
    stack.push(arguments[i]);
  }

  while (stack.length > 0) {
    let child = stack.pop();
    if (child && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }

    } else {
      if (typeof child === 'boolean') {
        child = null;
      }

      if ((simple = typeof nodeName !== 'function')) {
        if (child == null) {
          child = '';
        } else if (typeof child === 'number') {
          child = String(child);
        } else if (typeof child !== 'string') {
          simple = false;
        }
      }

      if (simple && lastSimple) {
        (children[children.length - 1] as d.VNode).vtext += child;

      } else if (children === null) {
        children = [simple ? { vtext: child } as d.VNode : child];

      } else {
        children.push(simple ? { vtext: child } as d.VNode : child);
      }

      lastSimple = simple;
    }
  }

  if (BUILD.vdomAttribute) {
    if (vnodeData != null) {
      // normalize class / classname attributes
      if (BUILD.vdomClass && vnodeData.className) {
        vnodeData['class'] = vnodeData.className;
      }

      if (BUILD.vdomClass && typeof vnodeData['class'] === 'object') {
        for ((i as any) in vnodeData['class']) {
          if (vnodeData['class'][i]) {
            stack.push(i);
          }
        }

        vnodeData['class'] = stack.join(' ');
        stack.length = 0;
      }

      if (BUILD.vdomKey && vnodeData.key != null) {
        vkey = vnodeData.key;
      }

      if (BUILD.slotRelocation && vnodeData.name != null) {
        vname = vnodeData.name;
      }
    }
  }

  if (BUILD.vdomFunctional && typeof nodeName === 'function') {
    // nodeName is a functional component
    return (nodeName as d.FunctionalComponent<any>)(vnodeData, children || [], vdomFnUtils);
  }

  const vnode: d.VNode = {
    vtag: nodeName,
    vchildren: children,
    elm: undefined,
    ishost: false,
  };

  if (BUILD.vdomAttribute) {
    vnode.vattrs = vnodeData;
  }

  if (BUILD.vdomText) {
    vnode.vtext = undefined;
  }

  if (BUILD.vdomKey) {
    vnode.vkey = vkey;
  }

  if (BUILD.slotRelocation) {
    vnode.vname = vname;
  }

  return vnode;
}

export const Host: d.FunctionalComponent<any> = {} as any;

const vdomFnUtils: d.FunctionalUtilities = {
  'forEach': (children, cb) => children.forEach(cb),
  'map': (children, cb) => children.map(cb)
};
