System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var c, e, s;
  return {
    setters: [ function(t) {
      c = t.r, e = t.h, s = t.e;
    } ],
    execute: function() {
      t("listen_reattach", /** @class */ function() {
        function class_1(t) {
          c(this, t), this.clicked = 0;
        }
        return class_1.prototype.click = function() {
          this.clicked++;
        }, class_1.prototype.render = function() {
          return e(s, null, e("div", {
            id: "clicked"
          }, "Clicked: ", this.clicked));
        }, class_1;
      }()).style = ".sc-listen-reattach-h { display: block; background: gray;}";
    }
  };
}));