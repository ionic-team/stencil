import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotLightDomContent = /** @class */ function() {
  function SlotLightDomContent(t) {
    registerInstance(this, t);
  }
  return SlotLightDomContent.prototype.render = function() {
    return h("header", null, h("section", null, h("article", null, h("slot", null))));
  }, SlotLightDomContent;
}();

export { SlotLightDomContent as slot_light_dom_content };