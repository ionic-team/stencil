System.register([ "./p-329d5583.system.js" ], (function(l) {
  "use strict";
  var t, s;
  return {
    setters: [ function(l) {
      t = l.r, s = l.h;
    } ],
    execute: function() {
      l("slot_reorder", /** @class */ function() {
        function class_1(l) {
          t(this, l), this.reordered = !1;
        }
        return class_1.prototype.render = function() {
          return this.reordered ? s("div", {
            class: "reordered"
          }, s("slot", {
            name: "slot-b"
          }, s("div", null, "fallback slot-b")), s("slot", null, s("div", null, "fallback default")), s("slot", {
            name: "slot-a"
          }, s("div", null, "fallback slot-a"))) : s("div", null, s("slot", null, s("div", null, "fallback default")), s("slot", {
            name: "slot-a"
          }, s("div", null, "fallback slot-a")), s("slot", {
            name: "slot-b"
          }, s("div", null, "fallback slot-b")));
        }, class_1;
      }());
    }
  };
}));