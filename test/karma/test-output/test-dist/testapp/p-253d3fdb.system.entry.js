System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var o, r;
  return {
    setters: [ function(t) {
      o = t.r, r = t.h;
    } ],
    execute: function() {
      t("dynamic_css_variable", /** @class */ function() {
        function class_1(t) {
          o(this, t), this.bgColor = "white";
        }
        return class_1.prototype.getBackgroundStyle = function() {
          return this.bgColor && "white" !== this.bgColor ? {
            background: this.bgColor,
            "--font-color": "white"
          } : {};
        }, class_1.prototype.changeColor = function() {
          "white" === this.bgColor ? this.bgColor = "red" : this.bgColor = "white";
        }, class_1.prototype.render = function() {
          return [ r("header", {
            style: this.getBackgroundStyle()
          }, "Dynamic CSS Variables!!"), r("main", null, r("p", null, r("button", {
            onClick: this.changeColor.bind(this)
          }, "Change Color"))) ];
        }, class_1;
      }()).style = ":root{--font-color:blue}header{color:var(--font-color)}";
    }
  };
}));