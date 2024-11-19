import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp14.js';

const SlotLightDomRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.a = 'a';
    this.b = 'b';
    this.c = 'c';
    this.d = 'd';
    this.e = 'e';
    this.f = 'f';
    this.g = 'g';
    this.h = 'h';
    this.i = 'i';
    this.j = 'j';
    this.k = 'k';
    this.l = 'l';
    this.m = 'm';
  }
  testClick() {
    this.a = 'A';
    this.b = 'B';
    this.c = 'C';
    this.d = 'D';
    this.e = 'E';
    this.f = 'F';
    this.g = 'G';
    this.h = 'H';
    this.i = 'I';
    this.j = 'J';
    this.k = 'K';
    this.l = 'L';
    this.m = 'M';
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test"), h("slot-light-dom-content", { class: "results1" }, this.a), h("slot-light-dom-content", { class: "results2" }, this.b), h("slot-light-dom-content", { class: "results3" }, h("nav", null, this.c)), h("slot-light-dom-content", { class: "results4" }, h("nav", null, this.d), this.e), h("slot-light-dom-content", { class: "results5" }, this.f, h("nav", null, this.g)), h("slot-light-dom-content", { class: "results6" }, this.h, h("nav", null, this.i), this.j), h("slot-light-dom-content", { class: "results7" }, h("nav", null, this.k), h("nav", null, this.l), h("nav", null, this.m))));
  }
}, [0, "slot-light-dom-root", {
    "a": [32],
    "b": [32],
    "c": [32],
    "d": [32],
    "e": [32],
    "f": [32],
    "g": [32],
    "h": [32],
    "i": [32],
    "j": [32],
    "k": [32],
    "l": [32],
    "m": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-light-dom-root", "slot-light-dom-content"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-light-dom-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotLightDomRoot$1);
      }
      break;
    case "slot-light-dom-content":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotLightDomRoot = SlotLightDomRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotLightDomRoot, defineCustomElement };
