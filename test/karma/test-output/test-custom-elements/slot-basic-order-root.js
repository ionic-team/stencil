import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp11.js';

const SlotBasicOrderRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("slot-basic-order", null, h("content-a", null, "a"), h("content-b", null, "b"), h("content-c", null, "c")));
  }
}, [0, "slot-basic-order-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-basic-order-root", "slot-basic-order"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-basic-order-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotBasicOrderRoot$1);
      }
      break;
    case "slot-basic-order":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotBasicOrderRoot = SlotBasicOrderRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotBasicOrderRoot, defineCustomElement };
