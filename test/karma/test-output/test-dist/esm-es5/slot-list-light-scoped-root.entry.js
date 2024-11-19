var __spreadArray = this && this.__spreadArray || function(t, e, o) {
  if (o || 2 === arguments.length) for (var i, r = 0, s = e.length; r < s; r++) !i && r in e || (i || (i = Array.prototype.slice.call(e, 0, r)), 
  i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotListLightScopedRoot = /** @class */ function() {
  function SlotListLightScopedRoot(t) {
    registerInstance(this, t), this.items = [];
  }
  return SlotListLightScopedRoot.prototype.needMore = function() {
    var t = [ "Item ".concat(this.items.length + 1), "Item ".concat(this.items.length + 2), "Item ".concat(this.items.length + 3), "Item ".concat(this.items.length + 4) ];
    this.items = __spreadArray(__spreadArray([], this.items, !0), t, !0);
  }, SlotListLightScopedRoot.prototype.render = function() {
    var t = this;
    return h("div", null, h("button", {
      onClick: function() {
        return t.needMore();
      }
    }, "More"), h("slot-dynamic-scoped-list", {
      items: this.items
    }));
  }, SlotListLightScopedRoot;
}();

export { SlotListLightScopedRoot as slot_list_light_scoped_root };