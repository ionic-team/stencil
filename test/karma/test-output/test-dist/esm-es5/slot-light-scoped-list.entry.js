import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotLightScopedList = /** @class */ function() {
  function SlotLightScopedList(t) {
    registerInstance(this, t);
  }
  return SlotLightScopedList.prototype.render = function() {
    return [ h("section", null, "These are my items:"), h("article", {
      class: "list-wrapper",
      style: {
        border: "2px solid green"
      }
    }, h("slot", null)), h("div", null, "That's it....") ];
  }, SlotLightScopedList;
}();

export { SlotLightScopedList as slot_light_scoped_list };