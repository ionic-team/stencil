import { ComponentInstance, IonicUtils, VNode, VNodeData } from '../util/interfaces';
import { h } from './renderer/core';


export function generateVNode(utils: IonicUtils, elm: Node, instance: ComponentInstance, hostCss: string): VNode {
  let vnode = instance.render && instance.render(h, utils);
  if (!vnode) {
    // use the default render function instead
    vnode = h(elm,
      h('div',
        theme(hostCss, instance.mode, instance.color),
        h('slot')
      )
    );
  }

  delete vnode.sel;

  return vnode;
}


export function theme(cssClassName: string, mode?: string, color?: string): VNodeData {
  const cssClasses: any = {};

  cssClasses[`${cssClassName}`] = true;

  if (mode) {
    cssClasses[`${cssClassName}-${mode}`] = true;

    if (color) {
      cssClasses[`${cssClassName}-${color}`] = cssClasses[`${cssClassName}-${mode}-${color}`] = true;
    }
  }

  return {
    class: cssClasses
  };
}
