import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotChildrenRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("section", null, "ShadowRoot1", h("article", null, h("slot", null)), "ShadowRoot2"));
  }
}, [1, "slot-children-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-children-root"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-children-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotChildrenRoot$1);
      }
      break;
  } });
}

const SlotChildrenRoot = SlotChildrenRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotChildrenRoot, defineCustomElement };
