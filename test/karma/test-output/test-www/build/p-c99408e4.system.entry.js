System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n, o;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h, o = t.g;
    } ],
    execute: function() {
      t("lifecycle_unload_b", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.componentDidLoad = function() {
          this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
        }, class_1.prototype.disconnectedCallback = function() {
          var t = document.createElement("div");
          t.textContent = "cmp-b unload", this.results.appendChild(t);
        }, class_1.prototype.render = function() {
          return [ n("article", null, "cmp-b - top"), n("section", null, n("slot", null)), n("nav", null, "cmp-b - bottom") ];
        }, Object.defineProperty(class_1.prototype, "el", {
          get: function() {
            return o(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }());
    }
  };
}));