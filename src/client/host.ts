import { Component, VNode, VNodeData } from '../util/interfaces';


export function generateVNode(elm: Node, instance: Component): VNode {
  const vnode = instance.render && instance.render();
  if (vnode) {
    vnode.elm = elm;
    delete vnode.sel;
  }

  return vnode;
}


export function themeVNodeData(instance: Component, cssClassName: string, vnodeData: VNodeData = {}): VNodeData {
  const cssClasses = vnodeData['class'] = vnodeData['class'] || {};
  const mode = instance.mode;
  const color = instance.color;

  cssClasses[cssClassName] = true;

  if (mode) {
    cssClasses[`${cssClassName}-${mode}`] = true;

    if (color) {
      cssClasses[`${cssClassName}-${color}`] = cssClasses[`${cssClassName}-${mode}-${color}`] = true;
    }
  }

  return vnodeData;
}
