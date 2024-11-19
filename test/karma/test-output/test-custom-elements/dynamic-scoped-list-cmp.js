import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './list-cmp2.js';

const DynamicListScopedComponent = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.items = [];
  }
  render() {
    return (h("slot-light-scoped-list", null, this.items.map((item) => (h("div", null, item)))));
  }
}, [2, "slot-dynamic-scoped-list", {
    "items": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-dynamic-scoped-list", "slot-light-scoped-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-dynamic-scoped-list":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DynamicListScopedComponent);
      }
      break;
    case "slot-light-scoped-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { DynamicListScopedComponent as D, defineCustomElement as d };
