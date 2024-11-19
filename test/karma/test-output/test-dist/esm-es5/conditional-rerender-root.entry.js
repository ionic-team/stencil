import { r as registerInstance, h } from "./index-a2c0d171.js";

var ConditionalRerenderRoot = /** @class */ function() {
  function ConditionalRerenderRoot(o) {
    registerInstance(this, o), this.showContent = !1, this.showFooter = !1;
  }
  return ConditionalRerenderRoot.prototype.componentDidLoad = function() {
    var o = this;
    this.showFooter = !0, setTimeout((function() {
      return o.showContent = !0;
    }), 20);
  }, ConditionalRerenderRoot.prototype.render = function() {
    return h("conditional-rerender", null, h("header", null, "Header"), this.showContent ? h("section", null, "Content") : null, this.showFooter ? h("footer", null, "Footer") : null);
  }, ConditionalRerenderRoot;
}();

export { ConditionalRerenderRoot as conditional_rerender_root };