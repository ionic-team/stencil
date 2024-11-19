System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, n;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h;
    } ],
    execute: function() {
      e("custom_element_child", /** @class */ function() {
        function class_1(e) {
          t(this, e);
        }
        return class_1.prototype.render = function() {
          return n("div", null, n("strong", null, "Child Component Loaded!"), n("h3", null, "Child Nested Component?"), n("custom-element-nested-child", null));
        }, class_1;
      }());
    }
  };
}));