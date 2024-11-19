import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotBasicOrderRoot = /** @class */ function() {
  function SlotBasicOrderRoot(t) {
    registerInstance(this, t);
  }
  return SlotBasicOrderRoot.prototype.render = function() {
    return h("slot-basic-order", null, h("content-a", null, "a"), h("content-b", null, "b"), h("content-c", null, "c"));
  }, SlotBasicOrderRoot;
}();

export { SlotBasicOrderRoot as slot_basic_order_root };