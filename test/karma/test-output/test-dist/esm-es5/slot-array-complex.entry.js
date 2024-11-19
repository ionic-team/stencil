import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotArrayComplex = /** @class */ function() {
  function SlotArrayComplex(r) {
    registerInstance(this, r);
  }
  return SlotArrayComplex.prototype.render = function() {
    return [ h("slot", {
      name: "start"
    }), h("section", null, h("slot", null)), h("slot", {
      name: "end"
    }) ];
  }, SlotArrayComplex;
}();

export { SlotArrayComplex as slot_array_complex };