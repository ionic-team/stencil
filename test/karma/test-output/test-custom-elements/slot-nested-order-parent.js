import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp-child.js';

const SlotNestedOrderParent$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("slot", null), h("slot-nested-order-child", null, h("slot", { name: "italic-slot-name" }), h("cmp-6", { slot: "end-slot-name" }, "6"))));
  }
}, [4, "slot-nested-order-parent"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-nested-order-parent", "slot-nested-order-child"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-nested-order-parent":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotNestedOrderParent$1);
      }
      break;
    case "slot-nested-order-child":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotNestedOrderParent = SlotNestedOrderParent$1;
const defineCustomElement = defineCustomElement$1;

export { SlotNestedOrderParent, defineCustomElement };
