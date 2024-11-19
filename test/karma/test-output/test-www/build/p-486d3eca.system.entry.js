System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("slot_dynamic_shadow_list", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.items = [];
        }
        return class_1.prototype.render = function() {
          return n("slot-light-list", null, this.items.map((function(t) {
            return n("div", null, t);
          })));
        }, class_1;
      }());
    }
  };
}));