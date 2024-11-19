System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h;
    } ],
    execute: function() {
      t("slot_dynamic_wrapper_root", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.tag = "section";
        }
        return class_1.prototype.changeWrapper = function() {
          "section" === this.tag ? this.tag = "article" : this.tag = "section";
        }, class_1.prototype.render = function() {
          return [ e("button", {
            onClick: this.changeWrapper.bind(this)
          }, "Change Wrapper"), e("slot-dynamic-wrapper", {
            tag: this.tag,
            class: "results1"
          }, e("h1", null, "parent text")) ];
        }, class_1;
      }());
    }
  };
}));