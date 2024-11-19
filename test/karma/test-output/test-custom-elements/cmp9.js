import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotArrayComplex = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("slot", { name: "start" }),
      h("section", null, h("slot", null)),
      h("slot", { name: "end" }),
    ];
  }
}, [4, "slot-array-complex"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-array-complex"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-array-complex":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotArrayComplex);
      }
      break;
  } });
}

export { SlotArrayComplex as S, defineCustomElement as d };
