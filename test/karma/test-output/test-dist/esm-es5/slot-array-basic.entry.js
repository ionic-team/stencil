import { r as registerInstance, h } from "./index-a2c0d171.js";

var cmpCss = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}", SlotArrayBasic = /** @class */ function() {
  function SlotArrayBasic(r) {
    registerInstance(this, r);
  }
  return SlotArrayBasic.prototype.render = function() {
    return [ h("header", null, "Header"), h("slot", null), h("footer", null, "Footer") ];
  }, SlotArrayBasic;
}();

SlotArrayBasic.style = cmpCss;

export { SlotArrayBasic as slot_array_basic };