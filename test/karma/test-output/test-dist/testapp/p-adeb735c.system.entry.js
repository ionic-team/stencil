System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var s, n;
  return {
    setters: [ function(t) {
      s = t.r, n = t.h;
    } ],
    execute: function() {
      t("listen_jsx", /** @class */ function() {
        function class_1(t) {
          s(this, t), this.wasClicked = "";
        }
        return class_1.prototype.onClick = function() {
          this.wasClicked = "Host event";
        }, class_1.prototype.render = function() {
          return n("span", {
            id: "result"
          }, this.wasClicked);
        }, class_1;
      }()).style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";
    }
  };
}));