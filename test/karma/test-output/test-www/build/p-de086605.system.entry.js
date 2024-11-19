System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, n;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h;
    } ],
    execute: function() {
      e("custom_element_root_different_name_than_class", /** @class */ function() {
        function class_1(e) {
          t(this, e);
        }
        return class_1.prototype.render = function() {
          return n("div", null, n("h2", null, "Root Element Loaded"), n("custom-element-child-different-name-than-class", null));
        }, class_1;
      }());
    }
  };
}));