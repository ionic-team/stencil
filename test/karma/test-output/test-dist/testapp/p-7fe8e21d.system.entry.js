System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, n, o;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h, o = e.g;
    } ],
    execute: function() {
      e("lifecycle_unload_a", /** @class */ function() {
        function class_1(e) {
          t(this, e);
        }
        return class_1.prototype.componentDidLoad = function() {
          this.results = this.el.ownerDocument.body.querySelector("#lifecycle-unload-results");
        }, class_1.prototype.disconnectedCallback = function() {
          var e = document.createElement("div");
          e.textContent = "cmp-a unload", this.results.appendChild(e);
        }, class_1.prototype.render = function() {
          return n("main", null, n("header", null, "cmp-a - top"), n("lifecycle-unload-b", null, "cmp-a - middle"), n("footer", null, "cmp-a - bottom"));
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