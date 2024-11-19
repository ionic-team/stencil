import { r as l, h as s } from "./p-55339060.js";

const a = class {
  constructor(s) {
    l(this, s), this.reordered = !1;
  }
  render() {
    return this.reordered ? s("div", {
      class: "reordered"
    }, s("slot", {
      name: "slot-b"
    }, s("div", null, "fallback slot-b")), s("slot", null, s("div", null, "fallback default")), s("slot", {
      name: "slot-a"
    }, s("div", null, "fallback slot-a"))) : s("div", null, s("slot", null, s("div", null, "fallback default")), s("slot", {
      name: "slot-a"
    }, s("div", null, "fallback slot-a")), s("slot", {
      name: "slot-b"
    }, s("div", null, "fallback slot-b")));
  }
};

export { a as slot_reorder }