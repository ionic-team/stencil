import { h, proxyCustomElement, HTMLElement } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp10.js';

const textA = 'A';
const spanA = h("span", null, "A");
const divA = h("div", null, "A");
const textB = 'B';
const spanB = h("span", null, "B");
const divB = h("div", null, "B");
const divC = h("div", null, "C");
const SlotBasicRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.inc = 1;
  }
  testClick() {
    this.inc++;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), h("div", { class: "inc" }, "Rendered: ", this.inc), h("div", { class: "results1" }, h("slot-basic", null, textA, textB)), h("div", { class: "results2" }, h("slot-basic", null, textA, spanB)), h("div", { class: "results3" }, h("slot-basic", null, textA, divB)), h("div", { class: "results4" }, h("slot-basic", null, h("footer", null, textA, divB))), h("div", { class: "results5" }, h("slot-basic", null, spanA, textB)), h("div", { class: "results6" }, h("slot-basic", null, spanA, spanB)), h("div", { class: "results7" }, h("slot-basic", null, spanA, divB)), h("div", { class: "results8" }, h("slot-basic", null, divA, textB)), h("div", { class: "results9" }, h("slot-basic", null, divA, spanB)), h("div", { class: "results10" }, h("slot-basic", null, divA, divB)), h("div", { class: "results11" }, h("slot-basic", null, divA, h("footer", null, divB), divC))));
  }
}, [0, "slot-basic-root", {
    "inc": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-basic-root", "slot-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-basic-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotBasicRoot$1);
      }
      break;
    case "slot-basic":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotBasicRoot = SlotBasicRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotBasicRoot, defineCustomElement };
