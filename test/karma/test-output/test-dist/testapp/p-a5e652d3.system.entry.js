System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("bad_shared_jsx", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          var t = s("div", null, "Do Not Share JSX Nodes!");
          return s("div", null, t, t);
        }, class_1;
      }());
    }
  };
}));