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

  for (var i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i]);
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--; ) {
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

  if (vnodeData) {
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
  }

  if (typeof nodeName === 'function') {
    // nodeName is a functional component
    return (nodeName as d.FunctionalComponent<any>)({
      ...vnodeData,
      children: children
    });
  }

  return {
    vtag: nodeName,
    vchildren: children,
    vtext: null,
    vattrs: vnodeData,
    vkey: vnodeData && vnodeData.key,
    elm: null,
    ishost: false
  } as d.VNode;
}
