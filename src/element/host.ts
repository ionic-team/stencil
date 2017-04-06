import { ComponentInstance, ComponentMeta, VNode, VNodeData } from '../util/interfaces';
import { h } from '../renderer/core';


export function generateVNode(elm: Node, instance: ComponentInstance, cmpMeta: ComponentMeta): VNode {
  let vnode = instance.render && instance.render();
  if (!vnode) {
    vnode = h(elm, h('div', getThemeData(instance, cmpMeta), h('slot')));
  }

  delete vnode.sel;

  return vnode;
}


function getThemeData(instance: ComponentInstance, cmpMeta: ComponentMeta): VNodeData {
  const cssClasses: any = {};

  cssClasses[`${cmpMeta.hostCss}`] = cssClasses[`${cmpMeta.hostCss}-${instance.mode}`] = true;

  if (instance.color) {
    cssClasses[`${cmpMeta.hostCss}-${instance.color}`] = cssClasses[`${cmpMeta.hostCss}-${instance.mode}-${instance.color}`] = true;
  }

  return {
    class: cssClasses
  };
}
