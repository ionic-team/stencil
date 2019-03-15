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
        (children[children.length - 1] as d.VNode).$text$ += child;

      } else if (children === null) {
        children = [simple ? { $flags$: 0, $text$: child } : child];

      } else {
        children.push(simple ? { $flags$: 0, $text$: child } : child);
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
    $tag$: nodeName,
    $children$: children,
    $elm$: undefined,
    $flags$: 0
  };

  if (BUILD.vdomAttribute) {
    vnode.$attrs$ = vnodeData;
  }

  if (BUILD.vdomText) {
    vnode.$text$ = undefined;
  }

  if (BUILD.vdomKey) {
    vnode.$key$ = vkey;
  }

  if (BUILD.slotRelocation) {
    vnode.$name$ = vname;
  }

  return vnode;
}

export const Host: d.FunctionalComponent<any> = {} as any;

const vdomFnUtils: d.FunctionalUtilities = {
  'forEach': (children, cb) => children.map(convertToPublic).forEach(cb),
  'map': (children, cb) => children.map(convertToPublic).map(cb).map(convertToPrivate)
};

const convertToPublic = (node: d.VNode): d.ChildNode => {
  return {
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$
  };
};

const convertToPrivate = (node: d.ChildNode): d.VNode => {
  return {
    $flags$: 0,
    $attrs$: node.vattrs,
    $children$: node.vchildren,
    $key$: node.vkey,
    $name$: node.vname,
    $tag$: node.vtag,
    $text$: node.vtext
  };
};
