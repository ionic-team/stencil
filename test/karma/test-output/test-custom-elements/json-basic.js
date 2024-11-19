import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const foo = "bar";

const JsonBasic$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", { id: "json-foo" }, foo);
  }
}, [0, "json-basic"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["json-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "json-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, JsonBasic$1);
      }
      break;
  } });
}

const JsonBasic = JsonBasic$1;
const defineCustomElement = defineCustomElement$1;

export { JsonBasic, defineCustomElement };
