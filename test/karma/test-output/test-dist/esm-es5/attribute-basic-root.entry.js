import { r as registerInstance, h, g as getElement } from "./index-a2c0d171.js";

var AttributeBasicRoot = /** @class */ function() {
  function AttributeBasicRoot(t) {
    registerInstance(this, t);
  }
  return AttributeBasicRoot.prototype.componentWillLoad = function() {
    this.url = new URL(window.location.href);
  }, AttributeBasicRoot.prototype.testClick = function() {
    var t = this.el.querySelector("attribute-basic");
    t.setAttribute("single", "single-update"), t.setAttribute("multi-word", "multiWord-update"), 
    t.setAttribute("my-custom-attr", "my-custom-attr-update"), t.setAttribute("getter", "getter-update");
  }, AttributeBasicRoot.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), h("attribute-basic", null), h("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname));
  }, Object.defineProperty(AttributeBasicRoot.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), AttributeBasicRoot;
}();

export { AttributeBasicRoot as attribute_basic_root };