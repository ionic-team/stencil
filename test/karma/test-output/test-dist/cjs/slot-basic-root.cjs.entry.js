'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const textA = 'A';
const spanA = index.h("span", null, "A");
const divA = index.h("div", null, "A");
const textB = 'B';
const spanB = index.h("span", null, "B");
const divB = index.h("div", null, "B");
const divC = index.h("div", null, "C");
const SlotBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.inc = 1;
  }
  testClick() {
    this.inc++;
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), index.h("div", { class: "inc" }, "Rendered: ", this.inc), index.h("div", { class: "results1" }, index.h("slot-basic", null, textA, textB)), index.h("div", { class: "results2" }, index.h("slot-basic", null, textA, spanB)), index.h("div", { class: "results3" }, index.h("slot-basic", null, textA, divB)), index.h("div", { class: "results4" }, index.h("slot-basic", null, index.h("footer", null, textA, divB))), index.h("div", { class: "results5" }, index.h("slot-basic", null, spanA, textB)), index.h("div", { class: "results6" }, index.h("slot-basic", null, spanA, spanB)), index.h("div", { class: "results7" }, index.h("slot-basic", null, spanA, divB)), index.h("div", { class: "results8" }, index.h("slot-basic", null, divA, textB)), index.h("div", { class: "results9" }, index.h("slot-basic", null, divA, spanB)), index.h("div", { class: "results10" }, index.h("slot-basic", null, divA, divB)), index.h("div", { class: "results11" }, index.h("slot-basic", null, divA, index.h("footer", null, divB), divC))));
  }
};

exports.slot_basic_root = SlotBasicRoot;
