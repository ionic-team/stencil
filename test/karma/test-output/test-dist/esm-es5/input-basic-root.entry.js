import { r as registerInstance, h, g as getElement } from "./index-a2c0d171.js";

var InputBasicRoot = /** @class */ function() {
  function InputBasicRoot(t) {
    registerInstance(this, t), this.value = void 0;
  }
  return InputBasicRoot.prototype.render = function() {
    var t = this;
    return h("div", null, h("p", null, "Value: ", h("span", {
      class: "value"
    }, this.value)), h("input", {
      type: "text",
      value: this.value,
      onInput: function(e) {
        return t.value = e.target.value;
      }
    }));
  }, Object.defineProperty(InputBasicRoot.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), InputBasicRoot;
}();

export { InputBasicRoot as input_basic_root };