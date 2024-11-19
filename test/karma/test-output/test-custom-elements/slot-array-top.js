import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotArrayTop$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return [h("span", null, "Content should be on top"), h("slot", null)];
  }
}, [1, "slot-array-top"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-array-top"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-array-top":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotArrayTop$1);
      }
      break;
  } });
}

const SlotArrayTop = SlotArrayTop$1;
const defineCustomElement = defineCustomElement$1;

export { SlotArrayTop, defineCustomElement };
