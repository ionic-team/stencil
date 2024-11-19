System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var n, e;
  return {
    setters: [ function(t) {
      n = t.r, e = t.h;
    } ],
    execute: function() {
      t("attribute_host", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.attrsAdded = !1;
        }
        return class_1.prototype.testClick = function() {
          this.attrsAdded = !this.attrsAdded;
        }, class_1.prototype.render = function() {
          var t = {};
          return this.attrsAdded ? (t.color = "lime", t.content = "attributes added", t.padding = !0, 
          t.margin = "", t.bold = "true", t["no-attr"] = null) : (t.content = "attributes removed", 
          t.padding = !1, t.bold = "false", t["no-attr"] = null), [ e("button", {
            onClick: this.testClick.bind(this)
          }, this.attrsAdded ? "Remove" : "Add", " Attributes"), e("section", Object.assign({}, t, {
            style: {
              "border-color": this.attrsAdded ? "black" : "",
              display: this.attrsAdded ? "block" : "inline-block",
              fontSize: this.attrsAdded ? "24px" : "",
              "--css-var": this.attrsAdded ? "12" : ""
            }
          })) ];
        }, class_1;
      }()).style = "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }";
    }
  };
}));