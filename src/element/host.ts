import { ComponentInstance, IonicUtils, VNode, VNodeData } from '../util/interfaces';
import { h } from '../renderer/core';


export function generateVNode(utils: IonicUtils, elm: Node, instance: ComponentInstance, hostCss: string): VNode {
  let vnode = instance.render && instance.render(h, utils);
  if (!vnode) {
    // use the default render function instead
    vnode = h(elm,
      h('div',
        theme(instance, hostCss),
        h('slot')
      )
    );
  }

  delete vnode.sel;

  return vnode;
}


export function theme(instance: ComponentInstance, hostCss: string): VNodeData {
  const cssClasses: any = {};

  cssClasses[`${hostCss}`] = cssClasses[`${hostCss}-${instance.mode}`] = true;

  if (instance.color) {
    cssClasses[`${hostCss}-${instance.color}`] = cssClasses[`${hostCss}-${instance.mode}-${instance.color}`] = true;
  }

  return {
    class: cssClasses
  };
}
