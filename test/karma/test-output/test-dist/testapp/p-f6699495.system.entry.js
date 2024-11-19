System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, i;
  return {
    setters: [ function(t) {
      e = t.r, i = t.g;
    } ],
    execute: function() {
      t("reflect_to_attr", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.str = "single", this.nu = 2, this.undef = void 0, this.null = null, 
          this.bool = !1, this.otherBool = !0, this.disabled = !1, this.dynamicStr = void 0, 
          this.dynamicNu = void 0;
        }
        return class_1.prototype.componentDidLoad = function() {
          this.dynamicStr = "value", this.el.dynamicNu = 123;
        }, Object.defineProperty(class_1.prototype, "el", {
          get: function() {
            return i(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }());
    }
  };
}));