System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e, n;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h, n = t.e;
    } ],
    execute: function() {
      t("static_styles", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return e(n, null, e("h1", null, "static get styles()"));
        }, class_1;
      }()).style = "h1 {\n        color: red;\n      }";
    }
  };
}));