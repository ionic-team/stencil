import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$3 } from './dynamic-shadow-list-cmp.js';
import { d as defineCustomElement$2 } from './list-cmp.js';

const SlotListLightRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
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
    return (h("div", null, h("button", { onClick: () => this.needMore() }, "More"), h("slot-dynamic-shadow-list", { items: this.items })));
  }
}, [0, "slot-list-light-root", {
    "items": [1040]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-list-light-root", "slot-dynamic-shadow-list", "slot-light-list"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-list-light-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotListLightRoot$1);
      }
      break;
    case "slot-dynamic-shadow-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "slot-light-list":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotListLightRoot = SlotListLightRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotListLightRoot, defineCustomElement };
