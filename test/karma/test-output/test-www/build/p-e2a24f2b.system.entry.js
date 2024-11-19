System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h;
    } ],
    execute: function() {
      t("reparent_style_no_vars", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return e("div", {
            class: "css-entry"
          }, "No CSS Variables");
        }, class_1;
      }()).style = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";
    }
  };
}));