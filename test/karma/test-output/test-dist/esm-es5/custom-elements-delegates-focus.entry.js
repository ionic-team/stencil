import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}", CustomElementsDelegatesFocus = /** @class */ function() {
  function CustomElementsDelegatesFocus(e) {
    registerInstance(this, e);
  }
  return CustomElementsDelegatesFocus.prototype.render = function() {
    return h(Host, null, h("input", null));
  }, Object.defineProperty(CustomElementsDelegatesFocus, "delegatesFocus", {
    get: function() {
      return !0;
    },
    enumerable: !1,
    configurable: !0
  }), CustomElementsDelegatesFocus;
}();

CustomElementsDelegatesFocus.style = sharedDelegatesFocusCss;

export { CustomElementsDelegatesFocus as custom_elements_delegates_focus };