System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("shadow_dom_array", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.values = [];
        }
        return class_1.prototype.render = function() {
          return this.values.map((function(t) {
            return n("div", null, t);
          }));
        }, class_1;
      }());
    }
  };
}));