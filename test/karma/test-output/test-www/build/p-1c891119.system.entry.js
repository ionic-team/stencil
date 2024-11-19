System.register([ "./p-329d5583.system.js" ], (function(s) {
  "use strict";
  var t, e;
  return {
    setters: [ function(s) {
      t = s.r, e = s.h;
    } ],
    execute: function() {
      s("scoped_basic_root", /** @class */ function() {
        function class_1(s) {
          t(this, s);
        }
        return class_1.prototype.render = function() {
          return e("scoped-basic", null, e("span", null, "light"));
        }, class_1;
      }()).style = {
        md: ".sc-scoped-basic-root-md-h{color:white}"
      };
    }
  };
}));