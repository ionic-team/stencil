'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotNestedOrderParent = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("slot", null), index.h("slot-nested-order-child", null, index.h("slot", { name: "italic-slot-name" }), index.h("cmp-6", { slot: "end-slot-name" }, "6"))));
  }
};

exports.slot_nested_order_parent = SlotNestedOrderParent;
