System.register([ "./p-329d5583.system.js" ], (function(s) {
  "use strict";
  var t, e, n, i;
  return {
    setters: [ function(s) {
      t = s.r, e = s.h, n = s.B, i = s.e;
    } ],
    execute: function() {
      s("build_data", /** @class */ function() {
        function class_1(s) {
          t(this, s);
        }
        return class_1.prototype.render = function() {
          return e(i, null, e("p", {
            class: "is-dev"
          }, "isDev: ", "".concat(n.isDev)), e("p", {
            class: "is-browser"
          }, "isBrowser: ", "".concat(n.isBrowser)), e("p", {
            class: "is-testing"
          }, "isTesting: ", "".concat(n.isTesting)));
        }, class_1;
      }());
    }
  };
}));