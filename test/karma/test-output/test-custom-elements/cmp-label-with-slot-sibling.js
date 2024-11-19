import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const CmpLabelWithSlotSibling$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("label", null, h("slot", null), h("div", null, "Non-slotted text"))));
  }
}, [6, "cmp-label-with-slot-sibling"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["cmp-label-with-slot-sibling"];
  components.forEach(tagName => { switch (tagName) {
    case "cmp-label-with-slot-sibling":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CmpLabelWithSlotSibling$1);
      }
      break;
  } });
}

const CmpLabelWithSlotSibling = CmpLabelWithSlotSibling$1;
const defineCustomElement = defineCustomElement$1;

export { CmpLabelWithSlotSibling, defineCustomElement };
