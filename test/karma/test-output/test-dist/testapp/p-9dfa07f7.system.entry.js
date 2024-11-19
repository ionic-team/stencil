System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("shadow_dom_basic_root", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return s("shadow-dom-basic", null, s("div", null, "light"));
        }, class_1;
      }()).style = "div {\n      background: rgb(255, 255, 0);\n    }";
    }
  };
}));