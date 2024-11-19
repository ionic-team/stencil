System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, o, s;
  return {
    setters: [ function(t) {
      e = t.r, o = t.i, s = t.h;
    } ],
    execute: function() {
      t("shadow_dom_mode", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.mode = o(this);
        }
        return class_1.prototype.render = function() {
          return s("div", null, this.mode);
        }, class_1;
      }()).style = {
        blue: ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}",
        red: ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}"
      };
    }
  };
}));