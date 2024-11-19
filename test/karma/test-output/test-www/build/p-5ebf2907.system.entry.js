System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var r, t;
  return {
    setters: [ function(e) {
      r = e.r, t = e.h;
    } ],
    execute: function() {
      e("slot_array_basic", /** @class */ function() {
        function class_1(e) {
          r(this, e);
        }
        return class_1.prototype.render = function() {
          return [ t("header", null, "Header"), t("slot", null), t("footer", null, "Footer") ];
        }, class_1;
      }()).style = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";
    }
  };
}));