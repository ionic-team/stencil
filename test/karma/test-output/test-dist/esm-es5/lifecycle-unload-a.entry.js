import { r as registerInstance, h, g as getElement } from "./index-a2c0d171.js";

var LifecycleUnloadA = /** @class */ function() {
  function LifecycleUnloadA(e) {
    registerInstance(this, e);
  }
  return LifecycleUnloadA.prototype.componentDidLoad = function() {
    this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
  }, LifecycleUnloadA.prototype.disconnectedCallback = function() {
    var e = document.createElement("div");
    e.textContent = "cmp-a unload", this.results.appendChild(e);
  }, LifecycleUnloadA.prototype.render = function() {
    return h("main", null, h("header", null, "cmp-a - top"), h("lifecycle-unload-b", null, "cmp-a - middle"), h("footer", null, "cmp-a - bottom"));
  }, Object.defineProperty(LifecycleUnloadA.prototype, "el", {
    get: function() {
      return getElement(this);
    },
    enumerable: !1,
    configurable: !0
  }), LifecycleUnloadA;
}();

export { LifecycleUnloadA as lifecycle_unload_a };