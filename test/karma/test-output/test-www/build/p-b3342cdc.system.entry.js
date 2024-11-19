System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, o;
  return {
    setters: [ function(t) {
      n = t.r, o = t.h;
    } ],
    execute: function() {
      t("conditional_rerender_root", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.showContent = !1, this.showFooter = !1;
        }
        return class_1.prototype.componentDidLoad = function() {
          var t = this;
          this.showFooter = !0, setTimeout((function() {
            return t.showContent = !0;
          }), 20);
        }, class_1.prototype.render = function() {
          return o("conditional-rerender", null, o("header", null, "Header"), this.showContent ? o("section", null, "Content") : null, this.showFooter ? o("footer", null, "Footer") : null);
        }, class_1;
      }());
    }
  };
}));