import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './custom-element-nested-child2.js';

const CustomElementChild = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!"), h("h3", null, "Child Nested Component?"), h("custom-element-nested-child", null)));
  }
}, [1, "custom-element-child"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-child", "custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementChild);
      }
      break;
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { CustomElementChild as C, defineCustomElement as d };
