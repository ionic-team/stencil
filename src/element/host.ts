import { ComponentInstance, ComponentMeta, VNode } from '../utils/interfaces';
import { h } from '../renderer/core';


export function generateVNode(elm: Node, instance: ComponentInstance, cmpMeta: ComponentMeta): VNode {
  let vnode = instance.render && instance.render();
  if (!vnode) {
    vnode = h(`.${cmpMeta.hostCss}`, h('slot'));
  }

  vnode.elm = elm;

  const hostCssClasses = vnode.data.class = vnode.data.class || {};
  const hostAttributes = vnode.data.attrs = vnode.data.attrs || {};

  hostAttributes.upgraded = '';

  const cssClasses = vnode.sel.split('.');
  for (var i = 1; i < cssClasses.length; i++) {
    hostCssClasses[cssClasses[i]] = true;
  }

  delete vnode.sel;

  hostCssClasses[`${cmpMeta.hostCss}-${instance.mode}`] = true;
  hostAttributes.mode = instance.mode;

  if (instance.color) {
    hostCssClasses[`${cmpMeta.hostCss}-${instance.color}`] = true;
    hostCssClasses[`${cmpMeta.hostCss}-${instance.mode}-${instance.color}`] = true;
    hostAttributes.color = instance.color;
  }

  return vnode;
}
