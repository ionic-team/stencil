System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, r;
  return {
    setters: [ function(t) {
      s = t.r, r = t.h;
    } ],
    execute: function() {
      t("reparent_style_with_vars", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return r("div", {
            class: "css-entry"
          }, "With CSS Vars");
        }, class_1;
      }()).style = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";
    }
  };
}));