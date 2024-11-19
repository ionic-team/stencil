System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("slot_children_root", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e("section", null, "ShadowRoot1", e("article", null, e("slot", null)), "ShadowRoot2");
        }, class_1;
      }());
    }
  };
}));