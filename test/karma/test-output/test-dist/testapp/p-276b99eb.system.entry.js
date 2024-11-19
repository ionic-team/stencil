System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n, s;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h, s = t.e;
    } ],
    execute: function() {
      t("slot_nested_order_parent", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return n(s, null, n("slot", null), n("slot-nested-order-child", null, n("slot", {
            name: "italic-slot-name"
          }), n("cmp-6", {
            slot: "end-slot-name"
          }, "6")));
        }, class_1;
      }());
    }
  };
}));