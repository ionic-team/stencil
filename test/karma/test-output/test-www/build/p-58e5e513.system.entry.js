System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h;
    } ],
    execute: function() {
      t("svg_attr", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.isOpen = !1;
        }
        return class_1.prototype.testClick = function() {
          this.isOpen = !this.isOpen;
        }, class_1.prototype.render = function() {
          return e("div", null, e("div", null, e("button", {
            onClick: this.testClick.bind(this)
          }, "Test")), e("div", null, this.isOpen ? e("svg", {
            viewBox: "0 0 54 54"
          }, e("rect", {
            transform: "rotate(45 27 27)",
            y: "22",
            width: "54",
            height: "10",
            rx: "2",
            stroke: "yellow",
            "stroke-width": "5px",
            "stroke-dasharray": "8 4"
          })) : e("svg", {
            viewBox: "0 0 54 54"
          }, e("rect", {
            y: "0",
            width: "54",
            height: "10",
            rx: "2",
            stroke: "blue",
            "stroke-width": "2px",
            "stroke-dasharray": "4 2"
          }))));
        }, class_1;
      }());
    }
  };
}));