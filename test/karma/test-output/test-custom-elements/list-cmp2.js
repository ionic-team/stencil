import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotLightScopedList = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid green' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
}, [4, "slot-light-scoped-list"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-light-scoped-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-light-scoped-list":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotLightScopedList);
      }
      break;
  } });
}

export { SlotLightScopedList as S, defineCustomElement as d };
