System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, r;
  return {
    setters: [ function(t) {
      e = t.r, r = t.h;
    } ],
    execute: function() {
      t("slot_reorder_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.reordered = !1;
        }
        return class_1.prototype.testClick = function() {
          this.reordered = !this.reordered;
        }, class_1.prototype.render = function() {
          return r("div", null, r("button", {
            onClick: this.testClick.bind(this),
            class: "test"
          }, "Test"), r("slot-reorder", {
            class: "results1",
            reordered: this.reordered
          }), r("hr", null), r("slot-reorder", {
            class: "results2",
            reordered: this.reordered
          }, r("div", null, "default content")), r("hr", null), r("slot-reorder", {
            class: "results3",
            reordered: this.reordered
          }, r("div", {
            slot: "slot-b"
          }, "slot-b content"), r("div", null, "default content"), r("div", {
            slot: "slot-a"
          }, "slot-a content")), r("hr", null), r("slot-reorder", {
            class: "results4",
            reordered: this.reordered
          }, r("div", {
            slot: "slot-b"
          }, "slot-b content"), r("div", {
            slot: "slot-a"
          }, "slot-a content"), r("div", null, "default content")));
        }, class_1;
      }());
    }
  };
}));