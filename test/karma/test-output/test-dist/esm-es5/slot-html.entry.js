import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotHtml = /** @class */ function() {
  function SlotHtml(t) {
    registerInstance(this, t), this.inc = 0;
  }
  return SlotHtml.prototype.render = function() {
    return h("div", null, h("hr", null), h("article", null, h("span", null, h("slot", {
      name: "start"
    }))), h("slot", null), h("section", null, h("slot", {
      name: "end"
    })));
  }, SlotHtml;
}();

export { SlotHtml as slot_html };