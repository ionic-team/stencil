import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ShadowDomArray = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.values = [];
  }
  render() {
    return this.values.map((v) => h("div", null, v));
  }
}, [1, "shadow-dom-array", {
    "values": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-array"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-array":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomArray);
      }
      break;
  } });
}

export { ShadowDomArray as S, defineCustomElement as d };
