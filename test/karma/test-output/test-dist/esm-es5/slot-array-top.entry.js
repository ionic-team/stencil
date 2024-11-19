import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotArrayTop = /** @class */ function() {
  function SlotArrayTop(r) {
    registerInstance(this, r);
  }
  return SlotArrayTop.prototype.render = function() {
    return [ h("span", null, "Content should be on top"), h("slot", null) ];
  }, SlotArrayTop;
}();

export { SlotArrayTop as slot_array_top };