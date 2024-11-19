System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n, u;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h, u = t.g;
    } ],
    execute: function() {
      t("input_basic_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.value = void 0;
        }
        return class_1.prototype.render = function() {
          var t = this;
          return n("div", null, n("p", null, "Value: ", n("span", {
            class: "value"
          }, this.value)), n("input", {
            type: "text",
            value: this.value,
            onInput: function(e) {
              return t.value = e.target.value;
            }
          }));
        }, Object.defineProperty(class_1.prototype, "el", {
          get: function() {
            return u(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }());
    }
  };
}));