import { r as l, h as n, e as o } from "./p-55339060.js";

const t = class {
  constructor(n) {
    l(this, n);
  }
  render() {
    return n(o, null, n("h1", null, "H1 Top", n("slot", {
      name: "h1"
    }), n("div", null, "H1 Bottom")), n("article", null, "Default Top", n("slot", null), "Default Bottom"), n("h6", null, n("section", null, "H6 Top", n("slot", {
      name: "h6"
    }), n("div", null, "H6 Bottom"))));
  }
};

t.style = "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }";

export { t as append_child }