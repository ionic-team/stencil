var __spreadArray = this && this.__spreadArray || function(t, i, o) {
  if (o || 2 === arguments.length) for (var e, r = 0, s = i.length; r < s; r++) !e && r in i || (e || (e = Array.prototype.slice.call(i, 0, r)), 
  e[r] = i[r]);
  return t.concat(e || Array.prototype.slice.call(i));
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var SlotListLightRoot = /** @class */ function() {
  function SlotListLightRoot(t) {
    registerInstance(this, t), this.items = [];
  }
  return SlotListLightRoot.prototype.needMore = function() {
    var t = [ "Item ".concat(this.items.length + 1), "Item ".concat(this.items.length + 2), "Item ".concat(this.items.length + 3), "Item ".concat(this.items.length + 4) ];
    this.items = __spreadArray(__spreadArray([], this.items, !0), t, !0);
  }, SlotListLightRoot.prototype.render = function() {
    var t = this;
    return h("div", null, h("button", {
      onClick: function() {
        return t.needMore();
      }
    }, "More"), h("slot-dynamic-shadow-list", {
      items: this.items
    }));
  }, SlotListLightRoot;
}();

export { SlotListLightRoot as slot_list_light_root };