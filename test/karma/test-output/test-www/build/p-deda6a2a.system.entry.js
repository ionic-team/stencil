System.register([ "./p-329d5583.system.js" ], (function(n) {
  "use strict";
  var s, c;
  return {
    setters: [ function(n) {
      s = n.r, c = n.h;
    } ],
    execute: function() {
      n("scoped_basic", /** @class */ function() {
        function class_1(n) {
          s(this, n);
        }
        return class_1.prototype.render = function() {
          return [ c("div", null, "scoped"), c("p", null, c("slot", null)) ];
        }, class_1;
      }()).style = ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }";
    }
  };
}));