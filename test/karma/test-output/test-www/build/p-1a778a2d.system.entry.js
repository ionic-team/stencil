System.register([ "./p-329d5583.system.js" ], (function(s) {
  "use strict";
  var t, e;
  return {
    setters: [ function(s) {
      t = s.r, e = s.h;
    } ],
    execute: function() {
      s("es5_addclass_svg", /** @class */ function() {
        function class_1(s) {
          t(this, s);
        }
        return class_1.prototype.render = function() {
          return e("div", null, e("svg", {
            viewBox: "0 0 8 8",
            class: "existing-css-class"
          }, e("circle", {
            cx: "2",
            cy: "2",
            width: "64",
            height: "64",
            r: "2"
          })));
        }, class_1;
      }());
    }
  };
}));