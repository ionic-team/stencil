import { r as registerInstance, h } from "./index-a2c0d171.js";

var ConditionalBasic = /** @class */ function() {
  function ConditionalBasic(t) {
    registerInstance(this, t), this.showContent = !1;
  }
  return ConditionalBasic.prototype.testClick = function() {
    this.showContent = !this.showContent;
  }, ConditionalBasic.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), h("div", {
      class: "results"
    }, this.showContent ? "Content" : ""));
  }, ConditionalBasic;
}();

export { ConditionalBasic as conditional_basic };