import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp5.js';

const ShadowDomArrayRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.values = [0];
  }
  addValue() {
    this.values = [...this.values, this.values.length];
  }
  render() {
    return (h("div", null, h("button", { onClick: this.addValue.bind(this) }, "Add Value"), h("shadow-dom-array", { values: this.values, class: "results1" })));
  }
}, [0, "shadow-dom-array-root", {
    "values": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-array-root", "shadow-dom-array"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-array-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomArrayRoot$1);
      }
      break;
    case "shadow-dom-array":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ShadowDomArrayRoot = ShadowDomArrayRoot$1;
const defineCustomElement = defineCustomElement$1;

export { ShadowDomArrayRoot, defineCustomElement };
