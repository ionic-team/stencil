System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("dom_reattach_clone_deep_slot", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e("div", {
            class: "wrapper"
          }, e("span", {
            class: "component-mark-up"
          }, "Component mark-up"), e("div", null, e("section", null, e("slot", null))));
        }, class_1;
      }());
    }
  };
}));