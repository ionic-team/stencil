System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("shadow_dom_basic", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return [ s("div", null, "shadow"), s("slot", null) ];
        }, class_1;
      }()).style = "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }";
    }
  };
}));