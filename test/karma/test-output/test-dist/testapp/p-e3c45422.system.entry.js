System.register([ "./p-329d5583.system.js" ], (function(r) {
  "use strict";
  var e, o, n;
  return {
    setters: [ function(r) {
      e = r.r, o = r.h, n = r.e;
    } ],
    execute: function() {
      r("css_variables_shadow_dom", /** @class */ function() {
        function class_1(r) {
          e(this, r), this.isGreen = !1;
        }
        return class_1.prototype.render = function() {
          var r = this;
          return o(n, {
            class: {
              "set-green": this.isGreen
            }
          }, o("div", {
            class: "inner-div"
          }, "Shadow: ", this.isGreen ? "Green" : "Red", " background"), o("div", {
            class: "black-global-shadow"
          }, "Shadow: Black background (global)"), o("button", {
            onClick: function() {
              r.isGreen = !r.isGreen;
            }
          }, "Toggle color"));
        }, class_1;
      }()).style = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}";
    }
  };
}));