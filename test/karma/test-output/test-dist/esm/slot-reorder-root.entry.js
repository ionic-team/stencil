import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotReorderRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.reordered = false;
  }
  testClick() {
    this.reordered = !this.reordered;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), h("slot-reorder", { class: "results1", reordered: this.reordered }), h("hr", null), h("slot-reorder", { class: "results2", reordered: this.reordered }, h("div", null, "default content")), h("hr", null), h("slot-reorder", { class: "results3", reordered: this.reordered }, h("div", { slot: "slot-b" }, "slot-b content"), h("div", null, "default content"), h("div", { slot: "slot-a" }, "slot-a content")), h("hr", null), h("slot-reorder", { class: "results4", reordered: this.reordered }, h("div", { slot: "slot-b" }, "slot-b content"), h("div", { slot: "slot-a" }, "slot-a content"), h("div", null, "default content"))));
  }
};

export { SlotReorderRoot as slot_reorder_root };
