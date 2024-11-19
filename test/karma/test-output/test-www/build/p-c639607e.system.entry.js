System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("listen_jsx_root", /** @class */ function() {
        function class_1(t) {
          var n = this;
          s(this, t), this.onClick = function() {
            n.wasClicked = "Parent event";
          }, this.wasClicked = "";
        }
        return class_1.prototype.render = function() {
          return [ n("span", {
            id: "result-root"
          }, this.wasClicked), n("listen-jsx", {
            onClick: this.onClick
          }) ];
        }, class_1;
      }());
    }
  };
}));