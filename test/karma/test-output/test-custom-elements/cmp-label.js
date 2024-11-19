import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const CmpLabel$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("label", null, h("slot", null))));
  }
}, [6, "cmp-label"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["cmp-label"];
  components.forEach(tagName => { switch (tagName) {
    case "cmp-label":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CmpLabel$1);
      }
      break;
  } });
}

const CmpLabel = CmpLabel$1;
const defineCustomElement = defineCustomElement$1;

export { CmpLabel, defineCustomElement };
