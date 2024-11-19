System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, s;
  return {
    setters: [ function(t) {
      n = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_html", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.inc = 0;
        }
        return class_1.prototype.render = function() {
          return s("div", null, s("hr", null), s("article", null, s("span", null, s("slot", {
            name: "start"
          }))), s("slot", null), s("section", null, s("slot", {
            name: "end"
          })));
        }, class_1;
      }());
    }
  };
}));