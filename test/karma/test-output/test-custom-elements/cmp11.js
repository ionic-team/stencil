import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotBasicOrder = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("slot", null);
  }
}, [4, "slot-basic-order"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-basic-order"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-basic-order":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotBasicOrder);
      }
      break;
  } });
}

export { SlotBasicOrder as S, defineCustomElement as d };
