import { r as registerInstance, h } from "./index-a2c0d171.js";

var DynamicListScopedComponent = /** @class */ function() {
  function DynamicListScopedComponent(n) {
    registerInstance(this, n), this.items = [];
  }
  return DynamicListScopedComponent.prototype.render = function() {
    return h("slot-light-scoped-list", null, this.items.map((function(n) {
      return h("div", null, n);
    })));
  }, DynamicListScopedComponent;
}();

export { DynamicListScopedComponent as slot_dynamic_scoped_list };