import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const StaticStyles$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("h1", null, "static get styles()")));
  }
  static get style() { return "h1 {\n        color: red;\n      }"; }
}, [0, "static-styles"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["static-styles"];
  components.forEach(tagName => { switch (tagName) {
    case "static-styles":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, StaticStyles$1);
      }
      break;
  } });
}

const StaticStyles = StaticStyles$1;
const defineCustomElement = defineCustomElement$1;

export { StaticStyles, defineCustomElement };
