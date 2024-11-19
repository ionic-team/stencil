System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_array_complex", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return [ s("slot", {
            name: "start"
          }), s("section", null, s("slot", null)), s("slot", {
            name: "end"
          }) ];
        }, class_1;
      }());
    }
  };
}));