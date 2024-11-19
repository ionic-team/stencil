import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const CustomElementNestedChild = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("strong", null, "Child Nested Component Loaded!")));
  }
}, [1, "custom-element-nested-child"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementNestedChild);
      }
      break;
  } });
}

export { CustomElementNestedChild as C, defineCustomElement as d };
