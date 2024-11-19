import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$3 } from './dynamic-scoped-list-cmp.js';
import { d as defineCustomElement$2 } from './list-cmp2.js';

const SlotListLightScopedRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.items = [];
  }
  needMore() {
    const newItems = [
      `Item ${this.items.length + 1}`,
      `Item ${this.items.length + 2}`,
      `Item ${this.items.length + 3}`,
      `Item ${this.items.length + 4}`,
    ];
    this.items = [...this.items, ...newItems];
  }
  render() {
    return (h("div", null, h("button", { onClick: () => this.needMore() }, "More"), h("slot-dynamic-scoped-list", { items: this.items })));
  }
}, [0, "slot-list-light-scoped-root", {
    "items": [1040]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-list-light-scoped-root", "slot-dynamic-scoped-list", "slot-light-scoped-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-list-light-scoped-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotListLightScopedRoot$1);
      }
      break;
    case "slot-dynamic-scoped-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "slot-light-scoped-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotListLightScopedRoot = SlotListLightScopedRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotListLightScopedRoot, defineCustomElement };
