import { proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';

const ShadowDomSlotBasic$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  static get style() { return ":host {\n      color: red;\n    }"; }
}, [1, "shadow-dom-slot-basic"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-slot-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-slot-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomSlotBasic$1);
      }
      break;
  } });
}

const ShadowDomSlotBasic = ShadowDomSlotBasic$1;
const defineCustomElement = defineCustomElement$1;

export { ShadowDomSlotBasic, defineCustomElement };
