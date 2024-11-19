import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotMapOrderRoot = /** @class */ function() {
  function SlotMapOrderRoot(r) {
    registerInstance(this, r);
  }
  return SlotMapOrderRoot.prototype.render = function() {
    return h("slot-map-order", null, [ "a", "b", "c" ].map((function(r) {
      return h("div", null, h("input", {
        type: "text",
        value: r
      }));
    })));
  }, SlotMapOrderRoot;
}();

export { SlotMapOrderRoot as slot_map_order_root };