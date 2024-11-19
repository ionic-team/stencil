import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var SlotNestedOrderParent = /** @class */ function() {
  function SlotNestedOrderParent(e) {
    registerInstance(this, e);
  }
  return SlotNestedOrderParent.prototype.render = function() {
    return h(Host, null, h("slot", null), h("slot-nested-order-child", null, h("slot", {
      name: "italic-slot-name"
    }), h("cmp-6", {
      slot: "end-slot-name"
    }, "6")));
  }, SlotNestedOrderParent;
}();

export { SlotNestedOrderParent as slot_nested_order_parent };