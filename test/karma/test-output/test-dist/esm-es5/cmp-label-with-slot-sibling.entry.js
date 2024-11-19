import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var CmpLabelWithSlotSibling = /** @class */ function() {
  function CmpLabelWithSlotSibling(t) {
    registerInstance(this, t);
  }
  return CmpLabelWithSlotSibling.prototype.render = function() {
    return h(Host, null, h("label", null, h("slot", null), h("div", null, "Non-slotted text")));
  }, CmpLabelWithSlotSibling;
}();

export { CmpLabelWithSlotSibling as cmp_label_with_slot_sibling };