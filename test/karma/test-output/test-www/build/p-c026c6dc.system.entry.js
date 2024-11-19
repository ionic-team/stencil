System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("shadow_dom_slot_nested_root", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          var t = [ 0, 1, 2 ].map((function(t) {
            return e("shadow-dom-slot-nested", {
              i: t
            }, "light dom: ", t);
          }));
          return [ e("section", null, "shadow-dom-slot-nested"), e("article", null, t) ];
        }, class_1;
      }()).style = ":host {\n      color: green;\n      font-weight: bold;\n    }";
    }
  };
}));