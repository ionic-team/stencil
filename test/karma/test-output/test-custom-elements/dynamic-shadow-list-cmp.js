import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './list-cmp.js';

const DynamicListShadowComponent = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.items = [];
  }
  render() {
    return (h("slot-light-list", null, this.items.map((item) => (h("div", null, item)))));
  }
}, [1, "slot-dynamic-shadow-list", {
    "items": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-dynamic-shadow-list", "slot-light-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-dynamic-shadow-list":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DynamicListShadowComponent);
      }
      break;
    case "slot-light-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { DynamicListShadowComponent as D, defineCustomElement as d };
