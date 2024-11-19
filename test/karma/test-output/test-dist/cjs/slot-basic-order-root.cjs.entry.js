'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotBasicOrderRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("slot-basic-order", null, index.h("content-a", null, "a"), index.h("content-b", null, "b"), index.h("content-c", null, "c")));
  }
};

exports.slot_basic_order_root = SlotBasicOrderRoot;
