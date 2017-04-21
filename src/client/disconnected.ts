import { detachListeners } from './events';
import { ProxyElement } from '../util/interfaces';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(elm: ProxyElement) {
  if (elm) {
    const instance = elm.$instance;
    if (instance) {
      instance.ionViewWillUnload && instance.ionViewWillUnload();

      detachListeners(instance);

      instance.$vnode && invokeDestroyHook(instance.$vnode);
      elm.$instance = instance.$el = instance.$meta = instance.$root = instance.$vnode = null;
    }
  }
}
