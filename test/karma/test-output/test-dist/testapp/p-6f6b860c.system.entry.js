System.register([ "./p-329d5583.system.js" ], (function(n) {
  "use strict";
  var t, l, e;
  return {
    setters: [ function(n) {
      t = n.r, l = n.h, e = n.e;
    } ],
    execute: function() {
      n("append_child", /** @class */ function() {
        function class_1(n) {
          t(this, n);
        }
        return class_1.prototype.render = function() {
          return l(e, null, l("h1", null, "H1 Top", l("slot", {
            name: "h1"
          }), l("div", null, "H1 Bottom")), l("article", null, "Default Top", l("slot", null), "Default Bottom"), l("h6", null, l("section", null, "H6 Top", l("slot", {
            name: "h6"
          }), l("div", null, "H6 Bottom"))));
        }, class_1;
      }()).style = "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }";
    }
  };
}));