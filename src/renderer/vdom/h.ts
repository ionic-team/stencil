/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import * as d from '../../declarations';

const stack: any[] = [];


export function h(nodeName: string | d.FunctionalComponent<d.PropsType>, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
export function h(nodeName: string | d.FunctionalComponent<d.PropsType>, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
export function h(nodeName: any, vnodeData: any, child?: any) {
  let children: any[] = null;
  let lastSimple = false;
  let simple = false;

  for (var i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  while (stack.length > 0) {
    if ((child = stack.pop()) && child.pop !== undefined) {
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
        (<d.VNode>children[children.length - 1]).vtext += child;

      } else if (children === null) {
        children = [simple ? { vtext: child } as d.VNode : child];

      } else {
        children.push(simple ? { vtext: child } as d.VNode : child);
      }

      lastSimple = simple;
    }
  }

  let vkey: any;
  let vname: string;

  if (vnodeData != null) {
    // normalize class / classname attributes
    if (vnodeData['className']) {
      vnodeData['class'] = vnodeData['className'];
    }

    if (typeof vnodeData['class'] === 'object') {
      for ((i as any) in vnodeData['class']) {
        if (vnodeData['class'][i]) {
          stack.push(i);
        }
      }

      vnodeData['class'] = stack.join(' ');
      stack.length = 0;
    }

    if (vnodeData.key != null) {
      vkey = vnodeData.key;
    }

    if (vnodeData.name != null) {
      vname = vnodeData.name;
    }
  }

  if (typeof nodeName === 'function') {
    // nodeName is a functional component
    return (nodeName as d.FunctionalComponent<any>)({
      ...vnodeData,
      children: children
    }, utils);
  }

  return {
    vtag: nodeName,
    vchildren: children,
    vtext: undefined,
    vattrs: vnodeData,
    vkey: vkey,
    vname: vname,
    elm: undefined,
    ishost: false
  } as d.VNode;
}

const utils = {
  'getAttributes': function(vnode: d.VNode) {
    return vnode.vattrs;
  },
  'replaceAttributes': function(vnode: d.VNode, attributes: any) {
    vnode.vattrs = attributes;
  }
};
