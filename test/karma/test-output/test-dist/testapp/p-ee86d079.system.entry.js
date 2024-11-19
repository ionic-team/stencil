System.register([ "./p-329d5583.system.js" ], (function(s) {
  "use strict";
  var t, i;
  return {
    setters: [ function(s) {
      t = s.r, i = s.h;
    } ],
    execute: function() {
      s("svg_class", /** @class */ function() {
        function class_1(s) {
          t(this, s), this.hasColor = !1;
        }
        return class_1.prototype.testClick = function() {
          this.hasColor = !this.hasColor;
        }, class_1.prototype.render = function() {
          return i("div", null, i("div", null, i("button", {
            onClick: this.testClick.bind(this)
          }, "Test")), i("div", null, i("svg", {
            viewBox: "0 0 54 54",
            class: this.hasColor ? "primary" : void 0
          }, i("circle", {
            cx: "8",
            cy: "18",
            width: "54",
            height: "8",
            r: "2",
            class: this.hasColor ? "red" : void 0
          }), i("rect", {
            y: "2",
            width: "54",
            height: "8",
            rx: "2",
            class: this.hasColor ? "blue" : void 0
          }))));
        }, class_1;
      }());
    }
  };
}));