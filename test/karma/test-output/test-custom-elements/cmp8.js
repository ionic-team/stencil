import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ShadowDomSlotNested = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.i = undefined;
  }
  render() {
    return [
      h("header", null, "shadow dom: ", this.i),
      h("footer", null, h("slot", null)),
    ];
  }
  static get style() { return "header {\n      color: red;\n    }"; }
}, [1, "shadow-dom-slot-nested", {
    "i": [2]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-slot-nested"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-slot-nested":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomSlotNested);
      }
      break;
  } });
}

export { ShadowDomSlotNested as S, defineCustomElement as d };
