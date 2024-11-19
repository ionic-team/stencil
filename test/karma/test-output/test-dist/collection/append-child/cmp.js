import { Host, h } from '@stencil/core';
export class AppendChild {
  render() {
    return (h(Host, null, h("h1", null, "H1 Top", h("slot", { name: "h1" }), h("div", null, "H1 Bottom")), h("article", null, "Default Top", h("slot", null), "Default Bottom"), h("h6", null, h("section", null, "H6 Top", h("slot", { name: "h6" }), h("div", null, "H6 Bottom")))));
  }
  static get is() { return "append-child"; }
  static get encapsulation() { return "scoped"; }
  static get styles() { return "h1 {\n      color: red;\n      font-weight: bold;\n    }\n    article {\n      color: green;\n      font-weight: bold;\n    }\n    section {\n      color: blue;\n      font-weight: bold;\n    }"; }
}
