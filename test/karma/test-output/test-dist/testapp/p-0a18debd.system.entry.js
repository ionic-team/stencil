System.register([ "./p-329d5583.system.js" ], (function(n) {
  "use strict";
  var t, e;
  return {
    setters: [ function(n) {
      t = n.r, e = n.h;
    } ],
    execute: function() {
      n("conditional_rerender", /** @class */ function() {
        function class_1(n) {
          t(this, n);
        }
        return class_1.prototype.render = function() {
          return e("main", null, e("slot", null), e("nav", null, "Nav"));
        }, class_1;
      }());
    }
  };
}));