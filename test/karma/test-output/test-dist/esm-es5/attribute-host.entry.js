import { r as registerInstance, h } from "./index-a2c0d171.js";

var AttributeHost = /** @class */ function() {
  function AttributeHost(t) {
    registerInstance(this, t), this.attrsAdded = !1;
  }
  return AttributeHost.prototype.testClick = function() {
    this.attrsAdded = !this.attrsAdded;
  }, AttributeHost.prototype.render = function() {
    var t = {};
    return this.attrsAdded ? (t.color = "lime", t.content = "attributes added", t.padding = !0, 
    t.margin = "", t.bold = "true", t["no-attr"] = null) : (t.content = "attributes removed", 
    t.padding = !1, t.bold = "false", t["no-attr"] = null), [ h("button", {
      onClick: this.testClick.bind(this)
    }, this.attrsAdded ? "Remove" : "Add", " Attributes"), h("section", Object.assign({}, t, {
      style: {
        "border-color": this.attrsAdded ? "black" : "",
        display: this.attrsAdded ? "block" : "inline-block",
        fontSize: this.attrsAdded ? "24px" : "",
        "--css-var": this.attrsAdded ? "12" : ""
      }
    })) ];
  }, AttributeHost;
}();

AttributeHost.style = "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }";

export { AttributeHost as attribute_host };