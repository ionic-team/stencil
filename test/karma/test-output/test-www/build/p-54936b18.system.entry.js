var __spreadArray = this && this.__spreadArray || function(t, e, s) {
  if (s || 2 === arguments.length) for (var r, i = 0, n = e.length; i < n; i++) !r && i in e || (r || (r = Array.prototype.slice.call(e, 0, i)), 
  r[i] = e[i]);
  return t.concat(r || Array.prototype.slice.call(e));
};

System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_list_light_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.items = [];
        }
        return class_1.prototype.needMore = function() {
          var t = [ "Item ".concat(this.items.length + 1), "Item ".concat(this.items.length + 2), "Item ".concat(this.items.length + 3), "Item ".concat(this.items.length + 4) ];
          this.items = __spreadArray(__spreadArray([], this.items, !0), t, !0);
        }, class_1.prototype.render = function() {
          var t = this;
          return s("div", null, s("button", {
            onClick: function() {
              return t.needMore();
            }
          }, "More"), s("slot-dynamic-shadow-list", {
            items: this.items
          }));
        }, class_1;
      }());
    }
  };
}));