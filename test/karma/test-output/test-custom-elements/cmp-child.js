import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const SlotNestedOrderChild = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("cmp-3", null, "3"), h("i", null, h("slot", null)), h("cmp-5", null, "5"), h("slot", { name: "end-slot-name" })));
  }
}, [4, "slot-nested-order-child"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-nested-order-child"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-nested-order-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotNestedOrderChild);
      }
      break;
  } });
}

export { SlotNestedOrderChild as S, defineCustomElement as d };
