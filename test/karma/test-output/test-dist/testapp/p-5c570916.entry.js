import { h as s, r as l } from "./p-55339060.js";

const t = "A", i = s("span", null, "A"), c = s("div", null, "A"), n = s("span", null, "B"), u = s("div", null, "B"), a = s("div", null, "C"), o = class {
  constructor(s) {
    l(this, s), this.inc = 1;
  }
  testClick() {
    this.inc++;
  }
  render() {
    return s("div", null, s("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), s("div", {
      class: "inc"
    }, "Rendered: ", this.inc), s("div", {
      class: "results1"
    }, s("slot-basic", null, t, "B")), s("div", {
      class: "results2"
    }, s("slot-basic", null, t, n)), s("div", {
      class: "results3"
    }, s("slot-basic", null, t, u)), s("div", {
      class: "results4"
    }, s("slot-basic", null, s("footer", null, t, u))), s("div", {
      class: "results5"
    }, s("slot-basic", null, i, "B")), s("div", {
      class: "results6"
    }, s("slot-basic", null, i, n)), s("div", {
      class: "results7"
    }, s("slot-basic", null, i, u)), s("div", {
      class: "results8"
    }, s("slot-basic", null, c, "B")), s("div", {
      class: "results9"
    }, s("slot-basic", null, c, n)), s("div", {
      class: "results10"
    }, s("slot-basic", null, c, u)), s("div", {
      class: "results11"
    }, s("slot-basic", null, c, s("footer", null, u), a)));
  }
};

export { o as slot_basic_root }