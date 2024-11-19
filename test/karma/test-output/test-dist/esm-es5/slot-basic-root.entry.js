import { h, r as registerInstance } from "./index-a2c0d171.js";

var textA = "A", spanA = h("span", null, "A"), divA = h("div", null, "A"), textB = "B", spanB = h("span", null, "B"), divB = h("div", null, "B"), divC = h("div", null, "C"), SlotBasicRoot = /** @class */ function() {
  function SlotBasicRoot(s) {
    registerInstance(this, s), this.inc = 1;
  }
  return SlotBasicRoot.prototype.testClick = function() {
    this.inc++;
  }, SlotBasicRoot.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), h("div", {
      class: "inc"
    }, "Rendered: ", this.inc), h("div", {
      class: "results1"
    }, h("slot-basic", null, textA, textB)), h("div", {
      class: "results2"
    }, h("slot-basic", null, textA, spanB)), h("div", {
      class: "results3"
    }, h("slot-basic", null, textA, divB)), h("div", {
      class: "results4"
    }, h("slot-basic", null, h("footer", null, textA, divB))), h("div", {
      class: "results5"
    }, h("slot-basic", null, spanA, textB)), h("div", {
      class: "results6"
    }, h("slot-basic", null, spanA, spanB)), h("div", {
      class: "results7"
    }, h("slot-basic", null, spanA, divB)), h("div", {
      class: "results8"
    }, h("slot-basic", null, divA, textB)), h("div", {
      class: "results9"
    }, h("slot-basic", null, divA, spanB)), h("div", {
      class: "results10"
    }, h("slot-basic", null, divA, divB)), h("div", {
      class: "results11"
    }, h("slot-basic", null, divA, h("footer", null, divB), divC)));
  }, SlotBasicRoot;
}();

export { SlotBasicRoot as slot_basic_root };