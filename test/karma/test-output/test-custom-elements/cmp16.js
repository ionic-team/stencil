import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotReorder = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.reordered = false;
  }
  render() {
    if (this.reordered) {
      return (h("div", { class: "reordered" }, h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b")), h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a"))));
    }
    return (h("div", null, h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a")), h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b"))));
  }
}, [4, "slot-reorder", {
    "reordered": [4]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-reorder"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-reorder":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotReorder);
      }
      break;
  } });
}

export { SlotReorder as S, defineCustomElement as d };
