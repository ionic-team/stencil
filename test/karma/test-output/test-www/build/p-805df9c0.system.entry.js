System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("shadow_dom_slot_nested", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.i = void 0;
        }
        return class_1.prototype.render = function() {
          return [ s("header", null, "shadow dom: ", this.i), s("footer", null, s("slot", null)) ];
        }, class_1;
      }()).style = "header {\n      color: red;\n    }";
    }
  };
}));