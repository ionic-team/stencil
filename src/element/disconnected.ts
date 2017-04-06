import { ComponentController } from '../util/interfaces';


export function disconnectedCallback(ctrl: ComponentController) {
  if (ctrl) {
    ctrl.instance = ctrl.vnode = ctrl.rootElm = null;
  }
}
