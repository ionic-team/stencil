System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var o, s;
  return {
    setters: [ function(t) {
      o = t.r, s = t.h;
    } ],
    execute: function() {
      t("slot_array_complex_root", /** @class */ function() {
        function class_1(t) {
          o(this, t), this.endSlot = !1;
        }
        return class_1.prototype.componentDidLoad = function() {
          this.endSlot = !this.endSlot;
        }, class_1.prototype.render = function() {
          return s("main", null, s("slot-array-complex", null, s("header", {
            slot: "start"
          }, "slot - start"), "slot - default", this.endSlot ? s("footer", {
            slot: "end"
          }, "slot - end") : null));
        }, class_1;
      }());
    }
  };
}));