import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var delegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}", DelegatesFocus = /** @class */ function() {
  function DelegatesFocus(e) {
    registerInstance(this, e);
  }
  return DelegatesFocus.prototype.render = function() {
    return h(Host, null, h("input", null));
  }, Object.defineProperty(DelegatesFocus, "delegatesFocus", {
    get: function() {
      return !0;
    },
    enumerable: !1,
    configurable: !0
  }), DelegatesFocus;
}();

DelegatesFocus.style = delegatesFocusCss;

export { DelegatesFocus as delegates_focus };