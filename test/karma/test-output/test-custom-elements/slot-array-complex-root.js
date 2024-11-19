import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp9.js';

const SlotArrayComplexRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.endSlot = false;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return (h("main", null, h("slot-array-complex", null, h("header", { slot: "start" }, "slot - start"), "slot - default", this.endSlot ? h("footer", { slot: "end" }, "slot - end") : null)));
  }
}, [0, "slot-array-complex-root", {
    "endSlot": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-array-complex-root", "slot-array-complex"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-array-complex-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotArrayComplexRoot$1);
      }
      break;
    case "slot-array-complex":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotArrayComplexRoot = SlotArrayComplexRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotArrayComplexRoot, defineCustomElement };
