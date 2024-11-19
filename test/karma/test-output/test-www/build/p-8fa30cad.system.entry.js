System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("slot_basic_order_root", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e("slot-basic-order", null, e("content-a", null, "a"), e("content-b", null, "b"), e("content-c", null, "c"));
        }, class_1;
      }());
    }
  };
}));