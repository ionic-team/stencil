import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './sibling-root2.js';

const StencilSibling$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("sibling-root", null, "sibling-light-dom")));
  }
}, [0, "stencil-sibling"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["stencil-sibling", "sibling-root"];
  components.forEach(tagName => { switch (tagName) {
    case "stencil-sibling":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, StencilSibling$1);
      }
      break;
    case "sibling-root":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const StencilSibling = StencilSibling$1;
const defineCustomElement = defineCustomElement$1;

export { StencilSibling, defineCustomElement };
