import { r as t, h as e } from "./p-55339060.js";

const s = class {
  constructor(e) {
    t(this, e), this.href = void 0;
  }
  componentDidLoad() {
    this.href = "http://stenciljs.com/";
  }
  render() {
    return e("main", null, e("slot-replace-wrapper", {
      href: this.href,
      class: "results1"
    }, e("content-end", {
      slot: "start"
    }, "A")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results2"
    }, e("content-end", null, "B")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results3"
    }, e("content-end", {
      slot: "end"
    }, "C")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results4"
    }, e("content-start", {
      slot: "start"
    }, "A"), e("content-default", null, "B"), e("content-end", {
      slot: "end"
    }, "C")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results5"
    }, e("content-default", null, "B"), e("content-end", {
      slot: "end"
    }, "C"), e("content-start", {
      slot: "start"
    }, "A")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results6"
    }, e("content-end", {
      slot: "end"
    }, "C"), e("content-start", {
      slot: "start"
    }, "A"), e("content-default", null, "B")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results7"
    }, e("content-start", {
      slot: "start"
    }, "A1"), e("content-start", {
      slot: "start"
    }, "A2"), e("content-default", null, "B1"), e("content-default", null, "B2"), e("content-end", {
      slot: "end"
    }, "C1"), e("content-end", {
      slot: "end"
    }, "C2")), e("slot-replace-wrapper", {
      href: this.href,
      class: "results8"
    }, e("content-default", null, "B1"), e("content-end", {
      slot: "end"
    }, "C1"), e("content-start", {
      slot: "start"
    }, "A1"), e("content-default", null, "B2"), e("content-end", {
      slot: "end"
    }, "C2"), e("content-start", {
      slot: "start"
    }, "A2")));
  }
};

export { s as slot_replace_wrapper_root }