System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("dom_reattach_clone", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return s("div", {
            class: "wrapper"
          }, s("span", {
            class: "component-mark-up"
          }, "Component mark-up"), s("slot", null));
        }, class_1;
      }());
    }
  };
}));