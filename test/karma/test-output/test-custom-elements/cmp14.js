import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotLightDomContent = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
}, [4, "slot-light-dom-content"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-light-dom-content"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-light-dom-content":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotLightDomContent);
      }
      break;
  } });
}

export { SlotLightDomContent as S, defineCustomElement as d };
