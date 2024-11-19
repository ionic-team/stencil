System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var l, n;
  return {
    setters: [ function(t) {
      l = t.r, n = t.h;
    } ],
    execute: function() {
      t("slot_fallback", /** @class */ function() {
        function class_1(t) {
          l(this, t), this.inc = 0;
        }
        return class_1.prototype.render = function() {
          return n("div", null, n("hr", null), n("slot", {
            name: "start"
          }, "slot start fallback ", this.inc), n("section", null, n("slot", null, "slot default fallback ", this.inc)), n("article", null, n("span", null, n("slot", {
            name: "end"
          }, "slot end fallback ", this.inc))));
        }, class_1;
      }());
    }
  };
}));