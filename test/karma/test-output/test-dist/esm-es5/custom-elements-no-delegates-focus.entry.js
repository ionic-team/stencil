import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}", CustomElementsNoDelegatesFocus = /** @class */ function() {
  function CustomElementsNoDelegatesFocus(e) {
    registerInstance(this, e);
  }
  return CustomElementsNoDelegatesFocus.prototype.render = function() {
    return h(Host, null, h("input", null));
  }, CustomElementsNoDelegatesFocus;
}();

CustomElementsNoDelegatesFocus.style = sharedDelegatesFocusCss;

export { CustomElementsNoDelegatesFocus as custom_elements_no_delegates_focus };