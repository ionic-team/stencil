var __spreadArray = this && this.__spreadArray || function(t, r, s) {
  if (s || 2 === arguments.length) for (var e, a = 0, n = r.length; a < n; a++) !e && a in r || (e || (e = Array.prototype.slice.call(r, 0, a)), 
  e[a] = r[a]);
  return t.concat(e || Array.prototype.slice.call(r));
};

System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var r, s;
  return {
    setters: [ function(t) {
      r = t.r, s = t.h;
    } ],
    execute: function() {
      t("shadow_dom_array_root", /** @class */ function() {
        function class_1(t) {
          r(this, t), this.values = [ 0 ];
        }
        return class_1.prototype.addValue = function() {
          this.values = __spreadArray(__spreadArray([], this.values, !0), [ this.values.length ], !1);
        }, class_1.prototype.render = function() {
          return s("div", null, s("button", {
            onClick: this.addValue.bind(this)
          }, "Add Value"), s("shadow-dom-array", {
            values: this.values,
            class: "results1"
          }));
        }, class_1;
      }());
    }
  };
}));