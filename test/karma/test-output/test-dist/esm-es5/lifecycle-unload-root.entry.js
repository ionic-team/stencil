import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleUnloadRoot = /** @class */ function() {
  function LifecycleUnloadRoot(e) {
    registerInstance(this, e), this.renderCmp = !0;
  }
  return LifecycleUnloadRoot.prototype.testClick = function() {
    this.renderCmp = !this.renderCmp;
  }, LifecycleUnloadRoot.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this)
    }, this.renderCmp ? "Remove" : "Add"), this.renderCmp ? h("lifecycle-unload-a", null) : null);
  }, LifecycleUnloadRoot;
}();

export { LifecycleUnloadRoot as lifecycle_unload_root };