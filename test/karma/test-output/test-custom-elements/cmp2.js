import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ConditionalRerender = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("main", null, h("slot", null), h("nav", null, "Nav")));
  }
}, [4, "conditional-rerender"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["conditional-rerender"];
  components.forEach(tagName => { switch (tagName) {
    case "conditional-rerender":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ConditionalRerender);
      }
      break;
  } });
}

export { ConditionalRerender as C, defineCustomElement as d };
