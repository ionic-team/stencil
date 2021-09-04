import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotBasic } from './cmp10.js';

const textA = 'A';
const spanA = h("span", null, "A");
const divA = h("div", null, "A");
const textB = 'B';
const spanB = h("span", null, "B");
const divB = h("div", null, "B");
const divC = h("div", null, "C");
const SlotBasicRoot$1 = class extends HTMLElement {
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
};

const SlotBasicRoot = /*@__PURE__*/proxyCustomElement(SlotBasicRoot$1, [0,"slot-basic-root",{"inc":[32]}]);
const components = ['slot-basic-root', 'slot-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-basic-root':
        tagName = 'slot-basic-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotBasicRoot);
        }
        break;

      case 'slot-basic':
        tagName = 'slot-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotBasic$1 = /*@__PURE__*/proxyCustomElement(SlotBasic, [0,"slot-basic-root",{"inc":[32]}]);
          customElements.define(tagName, SlotBasic$1);
        }
        break;

    }
  });
};

export { SlotBasicRoot, defineCustomElement };
