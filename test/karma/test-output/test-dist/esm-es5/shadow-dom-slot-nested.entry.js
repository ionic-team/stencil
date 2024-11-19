import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomSlotNested = /** @class */ function() {
  function ShadowDomSlotNested(o) {
    registerInstance(this, o), this.i = void 0;
  }
  return ShadowDomSlotNested.prototype.render = function() {
    return [ h("header", null, "shadow dom: ", this.i), h("footer", null, h("slot", null)) ];
  }, ShadowDomSlotNested;
}();

ShadowDomSlotNested.style = "header {\n      color: red;\n    }";

export { ShadowDomSlotNested as shadow_dom_slot_nested };