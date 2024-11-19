System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("custom_element_root", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return n("div", null, n("h2", null, "Root Element Loaded"), n("h3", null, "Child Component Loaded?"), n("custom-element-child", null));
        }, class_1;
      }());
    }
  };
}));