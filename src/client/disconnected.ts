import { ComponentController } from '../util/interfaces';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(ctrl: ComponentController) {
  if (ctrl) {
    ctrl.instance && ctrl.instance.ionViewWillUnload && ctrl.instance.ionViewWillUnload();
    ctrl.vnode && invokeDestroyHook(ctrl.vnode);
    ctrl.instance = ctrl.vnode = ctrl.rootElm = null;
  }
}
