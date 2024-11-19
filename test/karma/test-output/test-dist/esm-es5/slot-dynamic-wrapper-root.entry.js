import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotDynamicWrapperRoot = /** @class */ function() {
  function SlotDynamicWrapperRoot(t) {
    registerInstance(this, t), this.tag = "section";
  }
  return SlotDynamicWrapperRoot.prototype.changeWrapper = function() {
    "section" === this.tag ? this.tag = "article" : this.tag = "section";
  }, SlotDynamicWrapperRoot.prototype.render = function() {
    return [ h("button", {
      onClick: this.changeWrapper.bind(this)
    }, "Change Wrapper"), h("slot-dynamic-wrapper", {
      tag: this.tag,
      class: "results1"
    }, h("h1", null, "parent text")) ];
  }, SlotDynamicWrapperRoot;
}();

export { SlotDynamicWrapperRoot as slot_dynamic_wrapper_root };