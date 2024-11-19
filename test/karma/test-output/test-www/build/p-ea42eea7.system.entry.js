System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("slot_replace_wrapper", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.href = void 0;
        }
        return class_1.prototype.render = function() {
          var t = null != this.href ? "a" : "div", e = null != this.href ? {
            href: this.href,
            target: "_blank"
          } : {};
          return [ n(t, Object.assign({}, e), n("slot", {
            name: "start"
          }), n("span", null, n("slot", null), n("span", null, n("slot", {
            name: "end"
          })))), n("hr", null) ];
        }, class_1;
      }());
    }
  };
}));