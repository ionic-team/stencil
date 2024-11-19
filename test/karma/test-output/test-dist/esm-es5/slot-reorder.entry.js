import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotReorder = /** @class */ function() {
  function SlotReorder(l) {
    registerInstance(this, l), this.reordered = !1;
  }
  return SlotReorder.prototype.render = function() {
    return this.reordered ? h("div", {
      class: "reordered"
    }, h("slot", {
      name: "slot-b"
    }, h("div", null, "fallback slot-b")), h("slot", null, h("div", null, "fallback default")), h("slot", {
      name: "slot-a"
    }, h("div", null, "fallback slot-a"))) : h("div", null, h("slot", null, h("div", null, "fallback default")), h("slot", {
      name: "slot-a"
    }, h("div", null, "fallback slot-a")), h("slot", {
      name: "slot-b"
    }, h("div", null, "fallback slot-b")));
  }, SlotReorder;
}();

export { SlotReorder as slot_reorder };