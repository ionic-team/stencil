System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("attribute_basic", /** @class */ function() {
        function class_1(t) {
          e(this, t), this._getter = "getter", this.single = "single", this.multiWord = "multiWord", 
          this.customAttr = "my-custom-attr";
        }
        return Object.defineProperty(class_1.prototype, "getter", {
          get: function() {
            return this._getter;
          },
          set: function(t) {
            this._getter = t;
          },
          enumerable: !1,
          configurable: !0
        }), class_1.prototype.render = function() {
          return s("div", null, s("div", {
            class: "single"
          }, this.single), s("div", {
            class: "multiWord"
          }, this.multiWord), s("div", {
            class: "customAttr"
          }, this.customAttr), s("div", {
            class: "getter"
          }, this.getter), s("div", null, s("label", {
            class: "htmlForLabel",
            htmlFor: "a"
          }, "htmlFor"), s("input", {
            type: "checkbox",
            id: "a"
          })));
        }, class_1;
      }());
    }
  };
}));