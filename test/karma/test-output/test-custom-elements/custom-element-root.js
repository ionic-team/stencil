import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$3 } from './custom-element-child2.js';
import { d as defineCustomElement$2 } from './custom-element-nested-child2.js';

const CustomElementRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("h3", null, "Child Component Loaded?"), h("custom-element-child", null)));
  }
}, [1, "custom-element-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-root", "custom-element-child", "custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementRoot$1);
      }
      break;
    case "custom-element-child":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const CustomElementRoot = CustomElementRoot$1;
const defineCustomElement = defineCustomElement$1;

export { CustomElementRoot, defineCustomElement };
