import { r as registerInstance, h } from "./index-a2c0d171.js";

var AttributeBasic = /** @class */ function() {
  function AttributeBasic(t) {
    registerInstance(this, t), this._getter = "getter", this.single = "single", this.multiWord = "multiWord", 
    this.customAttr = "my-custom-attr";
  }
  return Object.defineProperty(AttributeBasic.prototype, "getter", {
    get: function() {
      return this._getter;
    },
    set: function(t) {
      this._getter = t;
    },
    enumerable: !1,
    configurable: !0
  }), AttributeBasic.prototype.render = function() {
    return h("div", null, h("div", {
      class: "single"
    }, this.single), h("div", {
      class: "multiWord"
    }, this.multiWord), h("div", {
      class: "customAttr"
    }, this.customAttr), h("div", {
      class: "getter"
    }, this.getter), h("div", null, h("label", {
      class: "htmlForLabel",
      htmlFor: "a"
    }, "htmlFor"), h("input", {
      type: "checkbox",
      id: "a"
    })));
  }, AttributeBasic;
}();

export { AttributeBasic as attribute_basic };