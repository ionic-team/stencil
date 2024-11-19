'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotListLightRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.items = [];
  }
  needMore() {
    const newItems = [
      `Item ${this.items.length + 1}`,
      `Item ${this.items.length + 2}`,
      `Item ${this.items.length + 3}`,
      `Item ${this.items.length + 4}`,
    ];
    this.items = [...this.items, ...newItems];
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: () => this.needMore() }, "More"), index.h("slot-dynamic-shadow-list", { items: this.items })));
  }
};

exports.slot_list_light_root = SlotListLightRoot;
