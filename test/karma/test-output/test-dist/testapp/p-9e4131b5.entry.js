import { r as t, h as o } from "./p-55339060.js";

const l = class {
  constructor(o) {
    t(this, o), this.endSlot = !1;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return o("main", null, o("slot-array-complex", null, o("header", {
      slot: "start"
    }, "slot - start"), "slot - default", this.endSlot ? o("footer", {
      slot: "end"
    }, "slot - end") : null));
  }
};

export { l as slot_array_complex_root }