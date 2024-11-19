import { r as t, h as r } from "./p-55339060.js";

const s = class {
  constructor(r) {
    t(this, r), this.tag = "section";
  }
  changeWrapper() {
    "section" === this.tag ? this.tag = "article" : this.tag = "section";
  }
  render() {
    return [ r("button", {
      onClick: this.changeWrapper.bind(this)
    }, "Change Wrapper"), r("slot-dynamic-wrapper", {
      tag: this.tag,
      class: "results1"
    }, r("h1", null, "parent text")) ];
  }
};

export { s as slot_dynamic_wrapper_root }