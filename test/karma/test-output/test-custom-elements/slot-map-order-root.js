import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp15.js';

const SlotMapOrderRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const items = ['a', 'b', 'c'];
    return (h("slot-map-order", null, items.map((item) => (h("div", null, h("input", { type: "text", value: item }))))));
  }
}, [0, "slot-map-order-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-map-order-root", "slot-map-order"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-map-order-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotMapOrderRoot$1);
      }
      break;
    case "slot-map-order":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotMapOrderRoot = SlotMapOrderRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotMapOrderRoot, defineCustomElement };
