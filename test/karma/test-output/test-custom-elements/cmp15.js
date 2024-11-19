import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotMapOrder = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("slot", null);
  }
}, [4, "slot-map-order"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-map-order"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-map-order":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotMapOrder);
      }
      break;
  } });
}

export { SlotMapOrder as S, defineCustomElement as d };
