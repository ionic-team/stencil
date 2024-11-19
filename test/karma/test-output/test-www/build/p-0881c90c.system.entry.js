System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, s;
  return {
    setters: [ function(e) {
      t = e.r, s = e.h;
    } ],
    execute: function() {
      e("key_reorder_root", /** @class */ function() {
        function class_1(e) {
          t(this, e), this.isReversed = !1;
        }
        return class_1.prototype.testClick = function() {
          this.isReversed = !this.isReversed;
        }, class_1.prototype.render = function() {
          var e = [ 0, 1, 2, 3, 4 ];
          return this.isReversed && e.reverse(), [ s("button", {
            onClick: this.testClick.bind(this)
          }, "Test"), s("div", null, e.map((function(e) {
            return s("div", {
              key: e,
              id: "item-" + e
            }, e);
          }))) ];
        }, class_1;
      }());
    }
  };
}));