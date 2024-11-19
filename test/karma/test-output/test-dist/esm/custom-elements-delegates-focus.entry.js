import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}";

const CustomElementsDelegatesFocus = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get delegatesFocus() { return true; }
};
CustomElementsDelegatesFocus.style = sharedDelegatesFocusCss;

export { CustomElementsDelegatesFocus as custom_elements_delegates_focus };
