import { r as registerInstance, h, g as getElement } from "./index-a2c0d171.js";

var LifecycleUnloadB = /** @class */ function() {
  function LifecycleUnloadB(e) {
    registerInstance(this, e);
  }
  return LifecycleUnloadB.prototype.componentDidLoad = function() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }, LifecycleUnloadB.prototype.disconnectedCallback = function() {
    var e = document.createElement("div");
    e.textContent = "cmp-b unload", this.results.appendChild(e);
  }, LifecycleUnloadB.prototype.render = function() {
    return [ h("article", null, "cmp-b - top"), h("section", null, h("slot", null)), h("nav", null, "cmp-b - bottom") ];
  }, Object.defineProperty(LifecycleUnloadB.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), LifecycleUnloadB;
}();

export { LifecycleUnloadB as lifecycle_unload_b };