import { ProxyElement } from '../util/interfaces';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(elm: ProxyElement) {
  if (elm) {
    const instance = elm.$instance;
    if (instance) {
      instance.ionViewWillUnload && instance.ionViewWillUnload();

      const destroys = instance.$destroys
      if (destroys) {
        for (var i = 0; i < destroys.length; i++) {
          destroys[i]();
        }
        destroys.length = 0;
      }

      instance.$vnode && invokeDestroyHook(instance.$vnode);
      elm.$instance = instance.$el = instance.$root = instance.$vnode = null;
    }
  }
}
