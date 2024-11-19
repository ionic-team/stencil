import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotLightList = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid blue' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
}, [4, "slot-light-list"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-light-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-light-list":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotLightList);
      }
      break;
  } });
}

export { SlotLightList as S, defineCustomElement as d };
