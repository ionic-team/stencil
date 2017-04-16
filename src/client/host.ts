import { ComponentInstance, VNode, VNodeData } from '../util/interfaces';
import { h } from './renderer/core';


export function generateVNode(elm: Node, instance: ComponentInstance, hostCss: string): VNode {
  let vnode = instance.render && instance.render();
  if (vnode) {
    vnode.elm = elm;

  } else {
    // use the default render function instead
    vnode = h(elm,
      h('div',
        themeVNodeData(instance, hostCss),
        h('slot')
      )
    );
  }

  delete vnode.sel;

  return vnode;
}


export function themeVNodeData(instance: ComponentInstance, cssClassName: string, vnodeData: VNodeData = {}): VNodeData {
  const cssClasses = vnodeData.class = vnodeData.class || {};
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
