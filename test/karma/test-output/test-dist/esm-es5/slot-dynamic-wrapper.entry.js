import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotDynamicWrapper = /** @class */ function() {
  function SlotDynamicWrapper(r) {
    registerInstance(this, r), this.tag = "section";
  }
  return SlotDynamicWrapper.prototype.render = function() {
    return h(this.tag, null, h("slot", null));
  }, SlotDynamicWrapper;
}();

export { SlotDynamicWrapper as slot_dynamic_wrapper };