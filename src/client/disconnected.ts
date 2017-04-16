import { ComponentController } from '../util/interfaces';
import { invokeDestroyHook } from './renderer/core';


export function disconnectedCallback(ctrl: ComponentController) {
  if (ctrl) {
    ctrl.vnode && invokeDestroyHook(ctrl.vnode);
    ctrl.instance = ctrl.vnode = ctrl.rootElm = null;
  }
}
