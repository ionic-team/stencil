import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotLightList = /** @class */ function() {
  function SlotLightList(t) {
    registerInstance(this, t);
  }
  return SlotLightList.prototype.render = function() {
    return [ h("section", null, "These are my items:"), h("article", {
      class: "list-wrapper",
      style: {
        border: "2px solid blue"
      }
    }, h("slot", null)), h("div", null, "That's it....") ];
  }, SlotLightList;
}();

export { SlotLightList as slot_light_list };