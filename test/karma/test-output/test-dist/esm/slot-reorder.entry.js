import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotReorder = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.reordered = false;
  }
  render() {
    if (this.reordered) {
      return (h("div", { class: "reordered" }, h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b")), h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a"))));
    }
    return (h("div", null, h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a")), h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b"))));
  }
};

export { SlotReorder as slot_reorder };
