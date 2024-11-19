import { r, h as e } from "./p-55339060.js";

const t = class {
  constructor(e) {
    r(this, e), this.reordered = !1;
  }
  testClick() {
    this.reordered = !this.reordered;
  }
  render() {
    return e("div", null, e("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), e("slot-reorder", {
      class: "results1",
      reordered: this.reordered
    }), e("hr", null), e("slot-reorder", {
      class: "results2",
      reordered: this.reordered
    }, e("div", null, "default content")), e("hr", null), e("slot-reorder", {
      class: "results3",
      reordered: this.reordered
    }, e("div", {
      slot: "slot-b"
    }, "slot-b content"), e("div", null, "default content"), e("div", {
      slot: "slot-a"
    }, "slot-a content")), e("hr", null), e("slot-reorder", {
      class: "results4",
      reordered: this.reordered
    }, e("div", {
      slot: "slot-b"
    }, "slot-b content"), e("div", {
      slot: "slot-a"
    }, "slot-a content"), e("div", null, "default content")));
  }
};

export { t as slot_reorder_root }