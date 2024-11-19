import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const AppendChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("h1", null, "H1 Top", h("slot", { name: "h1" }), h("div", null, "H1 Bottom")), h("article", null, "Default Top", h("slot", null), "Default Bottom"), h("h6", null, h("section", null, "H6 Top", h("slot", { name: "h6" }), h("div", null, "H6 Bottom")))));
  }
};
AppendChild.style = "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }";

export { AppendChild as append_child };
