import { r as n, h as o } from "./p-55339060.js";

const l = class {
  constructor(o) {
    n(this, o);
  }
  componentWillLoad() {
    return new Promise((n => {
      setTimeout(n, 50);
    }));
  }
  render() {
    return o("div", null, o("section", null, "sibling-shadow-dom"), o("article", null, o("slot", null)));
  }
};

l.style = ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }";

export { l as sibling_root }