System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("custom_element_nested_child", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.render = function() {
          return n("div", null, n("strong", null, "Child Nested Component Loaded!"));
        }, class_1;
      }());
    }
  };
}));