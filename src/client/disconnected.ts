import { detachListeners } from './events';
import { ProxyElement } from '../util/interfaces';
import { getParentElement } from '../util/helpers';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(elm: ProxyElement) {
  if (elm) {
    let tmpElm = elm;
    while (tmpElm) {
      if (tmpElm.$tmpDisconnected) {
        // a node may be in the process of moving from the host content
        // to a slot. If it is being moved, we don't actually want to run
        // the disconnect and connect code again, so we temporarily disable
        // disconnect cuz we're about to reconnect it again
        return;
      }
      tmpElm = getParentElement(tmpElm);
    }

    const instance = elm.$instance;
    if (instance) {
      instance.ionViewDidUnload && instance.ionViewDidUnload();

      detachListeners(instance);

      instance.$vnode && invokeDestroyHook(instance.$vnode);
      elm.$instance = elm.$hostContent = instance.$el = instance.$meta = instance.$root = instance.$vnode = instance.$watchers = instance.$values = null;
    }
  }
}
