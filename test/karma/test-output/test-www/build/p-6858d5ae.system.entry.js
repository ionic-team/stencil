System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e, s;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h, s = t.e;
    } ],
    execute: function() {
      t("cmp_label_with_slot_sibling", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e(s, null, e("label", null, e("slot", null), e("div", null, "Non-slotted text")));
        }, class_1;
      }());
    }
  };
}));