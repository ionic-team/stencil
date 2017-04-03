import { ComponentController } from '../utils/interfaces';


export function disconnectedCallback(ctrl: ComponentController) {
  if (ctrl) {
    ctrl.instance = ctrl.vnode = ctrl.rootElm = null;
  }
}
