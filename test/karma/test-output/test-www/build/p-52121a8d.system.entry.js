System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, r, s;
  return {
    setters: [ function(t) {
      e = t.r, r = t.h, s = t.g;
    } ],
    execute: function() {
      t("attribute_basic_root", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.componentWillLoad = function() {
          this.url = new URL(window.location.href);
        }, class_1.prototype.testClick = function() {
          var t = this.el.querySelector("attribute-basic");
          t.setAttribute("single", "single-update"), t.setAttribute("multi-word", "multiWord-update"), 
          t.setAttribute("my-custom-attr", "my-custom-attr-update"), t.setAttribute("getter", "getter-update");
        }, class_1.prototype.render = function() {
          return r("div", null, r("button", {
            onClick: this.testClick.bind(this)
          }, "Test"), r("attribute-basic", null), r("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname));
        }, Object.defineProperty(class_1.prototype, "el", {
          get: function() {
            return s(this);
          },
          enumerable: !1,
          configurable: !0
        }), class_1;
      }());
    }
  };
}));