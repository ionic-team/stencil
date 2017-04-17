import { ProxyElement } from '../util/interfaces';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(elm: ProxyElement) {
  if (elm) {
    const instance = elm.$instance;
    if (instance) {
      instance.ionViewWillUnload && instance.ionViewWillUnload();
      instance.$vnode && invokeDestroyHook(instance.$vnode);
      elm.$instance = instance.$elm = instance.$root = instance.$vnode = null;
    }
  }
}
