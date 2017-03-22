import { ComponentInstance, ComponentMeta, ProxyElement, VNode } from '../utils/interfaces';
import { h } from '../renderer/core';


export function generateVNode(elm: ProxyElement, instance: ComponentInstance, cmpMeta: ComponentMeta): VNode {
  let vnode = instance.render && instance.render();
  if (!vnode) {
    const tagSplit = cmpMeta.tag.split('-');
    vnode = h(`.${tagSplit[tagSplit.length - 1]}`);
  }

  vnode.elm = elm;

  const hostCss = vnode.data.class = vnode.data.class || {};

  let componentPrefix: string;
  const cssClasses = vnode.sel.split('.');
  if (cssClasses.length > 1) {
    componentPrefix = cssClasses[1] + '-';
    for (var i = 1; i < cssClasses.length; i++) {
      hostCss[cssClasses[i]] = true;
    }

  } else {
    componentPrefix = '';
  }
  vnode.sel = undefined;

  hostCss[`${componentPrefix}${instance.mode}`] = true;

  if (instance.color) {
    hostCss[`${componentPrefix}${instance.mode}-${instance.color}`] = true;
  }

  return vnode;
}
