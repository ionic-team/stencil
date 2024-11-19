import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotFallback = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("slot", { name: "start" }, "slot start fallback ", this.inc), h("section", null, h("slot", null, "slot default fallback ", this.inc)), h("article", null, h("span", null, h("slot", { name: "end" }, "slot end fallback ", this.inc)))));
  }
}, [4, "slot-fallback", {
    "inc": [2]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-fallback"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-fallback":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotFallback);
      }
      break;
  } });
}

export { SlotFallback as S, defineCustomElement as d };
