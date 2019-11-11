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
import { isComplexType } from '@utils';
import { STENCIL_DEV_MODE } from '../profile';

// const stack: any[] = [];

// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
export const h = (nodeName: any, vnodeData: any, ...children: d.ChildType[]): d.VNode => {
  let child = null;
  let key: string = null;
  let slotName: string = null;
  let simple = false;
  let lastSimple = false;
  let vNodeChildren: d.VNode[] = [];
  const walk = (c: any[]) => {
    for (let i = 0; i < c.length; i++) {
      child = c[i];
      if (Array.isArray(child)) {
        walk(child);
      } else if (child != null && typeof child !== 'boolean') {
        if (simple = typeof nodeName !== 'function' && !isComplexType(child)) {
          child = String(child);

        } else if (BUILD.isDev && child.$flags$ === undefined) {
          console.error(...STENCIL_DEV_MODE, `vNode passed as children has unexpected type.
Make sure it's using the correct h() function.
Empty objects can also be the cause, look for JSX comments that became objects.`);

        }

        if (simple && lastSimple) {
          // If the previous child was simple (string), we merge both
          vNodeChildren[vNodeChildren.length - 1].$text$ += child;
        } else {
          // Append a new vNode, if it's text, we create a text vNode
          vNodeChildren.push(simple ? newVNode(null, child) : child);
        }
        lastSimple = simple;
      }
    }
  };
  walk(children);
  if (vnodeData) {
    // normalize class / classname attributes
    if (BUILD.vdomKey && vnodeData.key) {
      key = vnodeData.key;
    }
    if (BUILD.slotRelocation && vnodeData.name) {
      slotName = vnodeData.name;
    }
    if (BUILD.vdomClass) {
      const classData = vnodeData.className || vnodeData.class;
      if (classData) {
        vnodeData.class = typeof classData !== 'object'
          ? classData
          : Object.keys(classData)
            .filter(k => classData[k])
            .join(' ');
      }
    }
  }

  if (BUILD.isDev && vNodeChildren.some(isHost)) {
    throw new Error(`The <Host> must be the single root component. Make sure:
- You are NOT using hostData() and <Host> in the same component.
- <Host> is used once, and it's the single root component of the render() function.`);
  }

  if (BUILD.vdomFunctional && typeof nodeName === 'function') {
    // nodeName is a functional component
    return (nodeName as d.FunctionalComponent<any>)(vnodeData, vNodeChildren, vdomFnUtils) as any;
  }

  const vnode = newVNode(nodeName, null);
  vnode.$attrs$ = vnodeData;
  if (vNodeChildren.length > 0) {
    vnode.$children$ = vNodeChildren;
  }
  if (BUILD.vdomKey) {
    vnode.$key$ = key;
  }
  if (BUILD.slotRelocation) {
    vnode.$name$ = slotName;
  }
  return vnode;
};

export const newVNode = (tag: string, text: string) => {
  const vnode: d.VNode = {
    $flags$: 0,
    $tag$: tag,
    $text$: text,
    $elm$: null,
    $children$: null
  };
  if (BUILD.vdomAttribute) {
    vnode.$attrs$ = null;
  }
  if (BUILD.vdomKey)  {
    vnode.$key$ = null;
  }
  if (BUILD.slotRelocation) {
    vnode.$name$ = null;
  }
  return vnode;
};

export const Host = {};

export const isHost = (node: any): node is d.VNode => {
  return node && node.$tag$ === Host;
};

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
  const vnode = newVNode(node.vtag as any, node.vtext);
  vnode.$attrs$ = node.vattrs;
  vnode.$children$ = node.vchildren;
  vnode.$key$ = node.vkey;
  vnode.$name$ = node.vname;
  return vnode;
};
