import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const FactoryJSX = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  getJsxNode() {
    return h("div", null, "Factory JSX");
  }
  render() {
    return (h("div", null, this.getJsxNode(), this.getJsxNode()));
  }
}, [0, "factory-jsx"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["factory-jsx"];
  components.forEach(tagName => { switch (tagName) {
    case "factory-jsx":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, FactoryJSX);
      }
      break;
  } });
}

const FactoryJsx = FactoryJSX;
const defineCustomElement = defineCustomElement$1;

export { FactoryJsx, defineCustomElement };
