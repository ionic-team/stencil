import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const AppendChild$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("h1", null, "H1 Top", h("slot", { name: "h1" }), h("div", null, "H1 Bottom")), h("article", null, "Default Top", h("slot", null), "Default Bottom"), h("h6", null, h("section", null, "H6 Top", h("slot", { name: "h6" }), h("div", null, "H6 Bottom")))));
  }
  static get style() { return "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }"; }
}, [6, "append-child"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["append-child"];
  components.forEach(tagName => { switch (tagName) {
    case "append-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AppendChild$1);
      }
      break;
  } });
}

const AppendChild = AppendChild$1;
const defineCustomElement = defineCustomElement$1;

export { AppendChild, defineCustomElement };
