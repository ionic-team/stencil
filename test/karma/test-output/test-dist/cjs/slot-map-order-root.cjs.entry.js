'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotMapOrderRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    const items = ['a', 'b', 'c'];
    return (index.h("slot-map-order", null, items.map((item) => (index.h("div", null, index.h("input", { type: "text", value: item }))))));
  }
};

exports.slot_map_order_root = SlotMapOrderRoot;
