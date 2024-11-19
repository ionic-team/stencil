import { r as registerInstance, h } from "./index-a2c0d171.js";

var DynamicListShadowComponent = /** @class */ function() {
  function DynamicListShadowComponent(n) {
    registerInstance(this, n), this.items = [];
  }
  return DynamicListShadowComponent.prototype.render = function() {
    return h("slot-light-list", null, this.items.map((function(n) {
      return h("div", null, n);
    })));
  }, DynamicListShadowComponent;
}();

export { DynamicListShadowComponent as slot_dynamic_shadow_list };