import { r as t, h as d } from "./p-55339060.js";

const n = class {
  constructor(d) {
    t(this, d), this.attrsAdded = !1;
  }
  testClick() {
    this.attrsAdded = !this.attrsAdded;
  }
  render() {
    const t = {};
    return this.attrsAdded ? (t.color = "lime", t.content = "attributes added", t.padding = !0, 
    t.margin = "", t.bold = "true", t["no-attr"] = null) : (t.content = "attributes removed", 
    t.padding = !1, t.bold = "false", t["no-attr"] = null), [ d("button", {
      onClick: this.testClick.bind(this)
    }, this.attrsAdded ? "Remove" : "Add", " Attributes"), d("section", Object.assign({}, t, {
      style: {
        "border-color": this.attrsAdded ? "black" : "",
        display: this.attrsAdded ? "block" : "inline-block",
        fontSize: this.attrsAdded ? "24px" : "",
        "--css-var": this.attrsAdded ? "12" : ""
      }
    })) ];
  }
};

n.style = "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }";

export { n as attribute_host }