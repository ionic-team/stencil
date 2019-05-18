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

// const stack: any[] = [];

// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
export const h = (nodeName: any, vnodeData: any, ...children: d.ChildType[]): d.VNode => {
  let simple = false;
  let lastSimple = false;
  const vNodeChildren: d.VNode[] = [];
  children.flat().forEach(child => {
    if (child != null) {
      if ((simple = typeof nodeName !== 'function')) {
        if (isComplexType(child)) {
          simple = false;
        } else {
          child = String(child);
        }
      }

      if (simple && lastSimple) {
        vNodeChildren[vNodeChildren.length - 1].$text$ += child;
      } else {
        vNodeChildren.push(simple ? { $flags$: 0, $text$: child } : child);
      }

      lastSimple = simple;
    }
  });
  if (BUILD.vdomAttribute) {
    vnodeData = vnodeData || {};
    // normalize class / classname attributes
    if (BUILD.vdomClass) {
      const classData = vnodeData.className || vnodeData.class;
      if (classData && typeof classData === 'object') {
        vnodeData.class = Object.keys(classData)
          .filter(k => classData[k])
          .join(' ');
      }
    }
  }

  if (BUILD.vdomFunctional && typeof nodeName === 'function') {
    // nodeName is a functional component
    return (nodeName as d.FunctionalComponent<any>)(vnodeData, vNodeChildren || [], vdomFnUtils) as any;
  }

  const vnode: d.VNode = {
    $flags$: 0,
    $tag$: nodeName,
    $children$: vNodeChildren.length > 0 ? vNodeChildren : null,
    $elm$: undefined,
    $attrs$: vnodeData,
  };
  if (BUILD.vdomKey) {
    vnode.$key$ = vnodeData.key;
  }
  if (BUILD.slotRelocation) {
    vnode.$name$ = vnodeData.name;
  }
  return vnode;
};

export const Host = {};

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
