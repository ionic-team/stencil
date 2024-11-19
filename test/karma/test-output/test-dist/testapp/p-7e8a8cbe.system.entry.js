System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, i;
  return {
    setters: [ function(t) {
      s = t.r, i = t.h;
    } ],
    execute: function() {
      t("slot_light_dom_root", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.a = "a", this.b = "b", this.c = "c", this.d = "d", this.e = "e", 
          this.f = "f", this.g = "g", this.h = "h", this.i = "i", this.j = "j", this.k = "k", 
          this.l = "l", this.m = "m";
        }
        return class_1.prototype.testClick = function() {
          this.a = "A", this.b = "B", this.c = "C", this.d = "D", this.e = "E", this.f = "F", 
          this.g = "G", this.h = "H", this.i = "I", this.j = "J", this.k = "K", this.l = "L", 
          this.m = "M";
        }, class_1.prototype.render = function() {
          return i("div", null, i("button", {
            onClick: this.testClick.bind(this)
          }, "Test"), i("slot-light-dom-content", {
            class: "results1"
          }, this.a), i("slot-light-dom-content", {
            class: "results2"
          }, this.b), i("slot-light-dom-content", {
            class: "results3"
          }, i("nav", null, this.c)), i("slot-light-dom-content", {
            class: "results4"
          }, i("nav", null, this.d), this.e), i("slot-light-dom-content", {
            class: "results5"
          }, this.f, i("nav", null, this.g)), i("slot-light-dom-content", {
            class: "results6"
          }, this.h, i("nav", null, this.i), this.j), i("slot-light-dom-content", {
            class: "results7"
          }, i("nav", null, this.k), i("nav", null, this.l), i("nav", null, this.m)));
        }, class_1;
      }());
    }
  };
}));