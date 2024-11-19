System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e, s;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h, s = t.e;
    } ],
    execute: function() {
      t("dom_reattach_clone_host", /** @class */ function() {
        function class_1(t) {
          n(this, t);
        }
        return class_1.prototype.render = function() {
          return e(s, null, e("span", {
            class: "component-mark-up"
          }, "Component mark-up"), e("slot", null));
        }, class_1;
      }());
    }
  };
}));