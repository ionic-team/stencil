System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, e, n;
  return {
    setters: [ function(t) {
      s = t.r, e = t.h, n = t.e;
    } ],
    execute: function() {
      t("no_delegates_focus", /** @class */ function() {
        function class_1(t) {
          s(this, t);
        }
        return class_1.prototype.render = function() {
          return e(n, null, e("input", null));
        }, class_1;
      }()).style = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}";
    }
  };
}));