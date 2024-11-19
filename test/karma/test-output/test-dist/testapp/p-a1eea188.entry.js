import { r as t, h as s } from "./p-55339060.js";

const e = class {
  constructor(s) {
    t(this, s), this.items = [];
  }
  needMore() {
    const t = [ `Item ${this.items.length + 1}`, `Item ${this.items.length + 2}`, `Item ${this.items.length + 3}`, `Item ${this.items.length + 4}` ];
    this.items = [ ...this.items, ...t ];
  }
  render() {
    return s("div", null, s("button", {
      onClick: () => this.needMore()
    }, "More"), s("slot-dynamic-shadow-list", {
      items: this.items
    }));
  }
};

export { e as slot_list_light_root }