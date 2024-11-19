System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("slot_map_order_root", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return n("slot-map-order", null, [ "a", "b", "c" ].map((function(t) {
            return n("div", null, n("input", {
              type: "text",
              value: t
            }));
          })));
        }, class_1;
      }());
    }
  };
}));