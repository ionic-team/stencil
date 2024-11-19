System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h;
    } ],
    execute: function() {
      t("slot_light_list", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return [ e("section", null, "These are my items:"), e("article", {
            class: "list-wrapper",
            style: {
              border: "2px solid blue"
            }
          }, e("slot", null)), e("div", null, "That's it....") ];
        }, class_1;
      }());
    }
  };
}));