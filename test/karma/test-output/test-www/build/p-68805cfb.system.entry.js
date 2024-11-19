System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("slot_dynamic_wrapper", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.tag = "section";
        }
        return class_1.prototype.render = function() {
          return n(this.tag, null, n("slot", null));
        }, class_1;
      }());
    }
  };
}));