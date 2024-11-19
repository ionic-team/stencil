'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotReorder = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.reordered = false;
  }
  render() {
    if (this.reordered) {
      return (index.h("div", { class: "reordered" }, index.h("slot", { name: "slot-b" }, index.h("div", null, "fallback slot-b")), index.h("slot", null, index.h("div", null, "fallback default")), index.h("slot", { name: "slot-a" }, index.h("div", null, "fallback slot-a"))));
    }
    return (index.h("div", null, index.h("slot", null, index.h("div", null, "fallback default")), index.h("slot", { name: "slot-a" }, index.h("div", null, "fallback slot-a")), index.h("slot", { name: "slot-b" }, index.h("div", null, "fallback slot-b"))));
  }
};

exports.slot_reorder = SlotReorder;
