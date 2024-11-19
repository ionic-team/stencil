'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotReorderRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.reordered = false;
  }
  testClick() {
    this.reordered = !this.reordered;
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), index.h("slot-reorder", { class: "results1", reordered: this.reordered }), index.h("hr", null), index.h("slot-reorder", { class: "results2", reordered: this.reordered }, index.h("div", null, "default content")), index.h("hr", null), index.h("slot-reorder", { class: "results3", reordered: this.reordered }, index.h("div", { slot: "slot-b" }, "slot-b content"), index.h("div", null, "default content"), index.h("div", { slot: "slot-a" }, "slot-a content")), index.h("hr", null), index.h("slot-reorder", { class: "results4", reordered: this.reordered }, index.h("div", { slot: "slot-b" }, "slot-b content"), index.h("div", { slot: "slot-a" }, "slot-a content"), index.h("div", null, "default content"))));
  }
};

exports.slot_reorder_root = SlotReorderRoot;
