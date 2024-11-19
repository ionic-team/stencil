import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotBasic = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
}, [4, "slot-basic"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotBasic);
      }
      break;
  } });
}

export { SlotBasic as S, defineCustomElement as d };
