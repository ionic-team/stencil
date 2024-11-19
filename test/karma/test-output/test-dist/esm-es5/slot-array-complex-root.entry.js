import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotArrayComplexRoot = /** @class */ function() {
  function SlotArrayComplexRoot(o) {
    registerInstance(this, o), this.endSlot = !1;
  }
  return SlotArrayComplexRoot.prototype.componentDidLoad = function() {
    this.endSlot = !this.endSlot;
  }, SlotArrayComplexRoot.prototype.render = function() {
    return h("main", null, h("slot-array-complex", null, h("header", {
      slot: "start"
    }, "slot - start"), "slot - default", this.endSlot ? h("footer", {
      slot: "end"
    }, "slot - end") : null));
  }, SlotArrayComplexRoot;
}();

export { SlotArrayComplexRoot as slot_array_complex_root };