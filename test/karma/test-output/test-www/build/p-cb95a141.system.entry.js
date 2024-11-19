System.register([ "./p-329d5583.system.js" ], (function(o) {
  "use strict";
  var t, e;
  return {
    setters: [ function(o) {
      t = o.r, e = o.h;
    } ],
    execute: function() {
      o("shadow_dom_mode_root", /** @class */ function() {
        function class_1(o) {
          t(this, o), this.showRed = !1;
        }
        return class_1.prototype.componentDidLoad = function() {
          var o = this;
          setTimeout((function() {
            o.showRed = !0;
          }), 50);
        }, class_1.prototype.render = function() {
          return e("div", null, e("shadow-dom-mode", {
            id: "blue",
            colormode: "blue"
          }), this.showRed ? e("shadow-dom-mode", {
            id: "red"
          }) : null);
        }, class_1;
      }());
    }
  };
}));