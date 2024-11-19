import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp16.js';

const SlotReorderRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.reordered = false;
  }
  testClick() {
    this.reordered = !this.reordered;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), h("slot-reorder", { class: "results1", reordered: this.reordered }), h("hr", null), h("slot-reorder", { class: "results2", reordered: this.reordered }, h("div", null, "default content")), h("hr", null), h("slot-reorder", { class: "results3", reordered: this.reordered }, h("div", { slot: "slot-b" }, "slot-b content"), h("div", null, "default content"), h("div", { slot: "slot-a" }, "slot-a content")), h("hr", null), h("slot-reorder", { class: "results4", reordered: this.reordered }, h("div", { slot: "slot-b" }, "slot-b content"), h("div", { slot: "slot-a" }, "slot-a content"), h("div", null, "default content"))));
  }
}, [0, "slot-reorder-root", {
    "reordered": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-reorder-root", "slot-reorder"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-reorder-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotReorderRoot$1);
      }
      break;
    case "slot-reorder":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotReorderRoot = SlotReorderRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotReorderRoot, defineCustomElement };
