System.register([ "./p-329d5583.system.js" ], (function(l) {
  "use strict";
  var o, a, c;
  return {
    setters: [ function(l) {
      o = l.r, a = l.h, c = l.e;
    } ],
    execute: function() {
      l("css_variables_no_encapsulation", /** @class */ function() {
        function class_1(l) {
          o(this, l);
        }
        return class_1.prototype.render = function() {
          return a(c, null, a("div", {
            class: "black-local"
          }, "No encapsulation: Black background"), a("div", {
            class: "black-global"
          }, "No encapsulation: Black background (global style)"), a("div", {
            class: "yellow-global"
          }, "No encapsulation: Yellow background (global link)"));
        }, class_1;
      }()).style = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}";
    }
  };
}));