import { detachListeners } from './events';
import { invokeDestroyHook } from './renderer/core';
import { PlatformApi, ProxyElement } from '../util/interfaces';


export function disconnectedCallback(plt: PlatformApi, elm: ProxyElement) {
  if (!plt.$tmpDisconnected) {
    const instance = elm.$instance;
    if (instance) {
      instance.ionViewDidUnload && instance.ionViewDidUnload();

      detachListeners(instance);

      instance.$vnode && invokeDestroyHook(instance.$vnode);
      elm.$instance = elm.$hostContent = elm.$hasRendered = elm.$hasConnected = instance.$el = instance.$meta = instance.$root = instance.$vnode = instance.$watchers = instance.$values = null;
    }
  }
}
