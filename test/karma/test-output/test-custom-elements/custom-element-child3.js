import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const CustomElementChild = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!")));
  }
}, [1, "custom-element-child-different-name-than-class"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-child-different-name-than-class"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-child-different-name-than-class":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementChild);
      }
      break;
  } });
}

export { CustomElementChild as C, defineCustomElement as d };
