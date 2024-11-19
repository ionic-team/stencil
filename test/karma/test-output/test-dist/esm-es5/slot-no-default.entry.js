import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var SlotNoDefault = /** @class */ function() {
  function SlotNoDefault(t) {
    registerInstance(this, t);
  }
  return SlotNoDefault.prototype.render = function() {
    return h(Host, null, h("slot", {
      name: "a-slot-name"
    }), h("section", null, h("slot", {
      name: "footer-slot-name"
    })), h("div", null, h("article", null, h("slot", {
      name: "nav-slot-name"
    }))));
  }, SlotNoDefault;
}();

export { SlotNoDefault as slot_no_default };