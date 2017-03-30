import { ComponentController } from '../utils/interfaces';


export function disconnectedCallback(ctrl: ComponentController) {
  if (ctrl) {
    ctrl.instance && ctrl.instance.disconnectedCallback && ctrl.instance.disconnectedCallback();

    ctrl.instance = ctrl.vnode = ctrl.root = null;
  }
}
