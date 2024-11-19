import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './custom-element-child3.js';

const CustomElementRoot = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("custom-element-child-different-name-than-class", null)));
  }
}, [1, "custom-element-root-different-name-than-class"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-root-different-name-than-class", "custom-element-child-different-name-than-class"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-root-different-name-than-class":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementRoot);
      }
      break;
    case "custom-element-child-different-name-than-class":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const CustomElementRootDifferentNameThanClass = CustomElementRoot;
const defineCustomElement = defineCustomElement$1;

export { CustomElementRootDifferentNameThanClass, defineCustomElement };
