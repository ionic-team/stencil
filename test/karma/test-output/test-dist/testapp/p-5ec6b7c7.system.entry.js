System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, s;
  return {
    setters: [ function(t) {
      e = t.r, s = t.h;
    } ],
    execute: function() {
      t("factory_jsx", /** @class */ function() {
        function class_1(t) {
          e(this, t);
        }
        return class_1.prototype.getJsxNode = function() {
          return s("div", null, "Factory JSX");
        }, class_1.prototype.render = function() {
          return s("div", null, this.getJsxNode(), this.getJsxNode());
        }, class_1;
      }());
    }
  };
}));