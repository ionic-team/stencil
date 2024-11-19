System.register([ "./p-329d5583.system.js" ], (function(n) {
  "use strict";
  var o, t;
  return {
    setters: [ function(n) {
      o = n.r, t = n.h;
    } ],
    execute: function() {
      n("sibling_root", /** @class */ function() {
        function class_1(n) {
          o(this, n);
        }
        return class_1.prototype.componentWillLoad = function() {
          return new Promise((function(n) {
            setTimeout(n, 50);
          }));
        }, class_1.prototype.render = function() {
          return t("div", null, t("section", null, "sibling-shadow-dom"), t("article", null, t("slot", null)));
        }, class_1;
      }()).style = ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }";
    }
  };
}));