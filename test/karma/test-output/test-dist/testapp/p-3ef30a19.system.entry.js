System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e, s;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h, s = t.e;
    } ],
    execute: function() {
      t("slot_no_default", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e(s, null, e("slot", {
            name: "a-slot-name"
          }), e("section", null, e("slot", {
            name: "footer-slot-name"
          })), e("div", null, e("article", null, e("slot", {
            name: "nav-slot-name"
          }))));
        }, class_1;
      }());
    }
  };
}));