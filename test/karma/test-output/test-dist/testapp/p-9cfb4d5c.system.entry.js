System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("conditional_basic", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.showContent = !1;
        }
        return class_1.prototype.testClick = function() {
          this.showContent = !this.showContent;
        }, class_1.prototype.render = function() {
          return n("div", null, n("button", {
            onClick: this.testClick.bind(this),
            class: "test"
          }, "Test"), n("div", {
            class: "results"
          }, this.showContent ? "Content" : ""));
        }, class_1;
      }());
    }
  };
}));