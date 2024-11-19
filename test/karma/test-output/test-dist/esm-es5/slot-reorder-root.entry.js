import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotReorderRoot = /** @class */ function() {
  function SlotReorderRoot(e) {
    registerInstance(this, e), this.reordered = !1;
  }
  return SlotReorderRoot.prototype.testClick = function() {
    this.reordered = !this.reordered;
  }, SlotReorderRoot.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), h("slot-reorder", {
      class: "results1",
      reordered: this.reordered
    }), h("hr", null), h("slot-reorder", {
      class: "results2",
      reordered: this.reordered
    }, h("div", null, "default content")), h("hr", null), h("slot-reorder", {
      class: "results3",
      reordered: this.reordered
    }, h("div", {
      slot: "slot-b"
    }, "slot-b content"), h("div", null, "default content"), h("div", {
      slot: "slot-a"
    }, "slot-a content")), h("hr", null), h("slot-reorder", {
      class: "results4",
      reordered: this.reordered
    }, h("div", {
      slot: "slot-b"
    }, "slot-b content"), h("div", {
      slot: "slot-a"
    }, "slot-a content"), h("div", null, "default content")));
  }, SlotReorderRoot;
}();

export { SlotReorderRoot as slot_reorder_root };