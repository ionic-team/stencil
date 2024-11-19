import { r as registerInstance, g as getElement } from "./index-a2c0d171.js";

var ReflectToAttr = /** @class */ function() {
  function ReflectToAttr(t) {
    registerInstance(this, t), this.str = "single", this.nu = 2, this.undef = void 0, 
    this.null = null, this.bool = !1, this.otherBool = !0, this.disabled = !1, this.dynamicStr = void 0, 
    this.dynamicNu = void 0;
  }
  return ReflectToAttr.prototype.componentDidLoad = function() {
    this.dynamicStr = "value", this.el.dynamicNu = 123;
  }, Object.defineProperty(ReflectToAttr.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), ReflectToAttr;
}();

export { ReflectToAttr as reflect_to_attr };