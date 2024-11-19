import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotBasic = /** @class */ function() {
  function SlotBasic(t) {
    registerInstance(this, t);
  }
  return SlotBasic.prototype.render = function() {
    return h("header", null, h("section", null, h("article", null, h("slot", null))));
  }, SlotBasic;
}();

export { SlotBasic as slot_basic };