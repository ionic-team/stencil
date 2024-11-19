System.register([ "./p-329d5583.system.js" ], (function(e) {
  "use strict";
  var t, s, n;
  return {
    setters: [ function(e) {
      t = e.r, s = e.h, n = e.e;
    } ],
    execute: function() {
      e("custom_elements_no_delegates_focus", /** @class */ function() {
        function class_1(e) {
          t(this, e);
        }
        return class_1.prototype.render = function() {
          return s(n, null, s("input", null));
        }, class_1;
      }()).style = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}";
    }
  };
}));