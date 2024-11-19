System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, n;
  return {
    setters: [ function(t) {
      e = t.r, n = t.h;
    } ],
    execute: function() {
      t("lifecycle_unload_root", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.renderCmp = !0;
        }
        return class_1.prototype.testClick = function() {
          this.renderCmp = !this.renderCmp;
        }, class_1.prototype.render = function() {
          return n("div", null, n("button", {
            onClick: this.testClick.bind(this)
          }, this.renderCmp ? "Remove" : "Add"), this.renderCmp ? n("lifecycle-unload-a", null) : null);
        }, class_1;
      }());
    }
  };
}));