import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const delegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}";

const DelegatesFocus = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get delegatesFocus() { return true; }
};
DelegatesFocus.style = delegatesFocusCss;

export { DelegatesFocus as delegates_focus };
