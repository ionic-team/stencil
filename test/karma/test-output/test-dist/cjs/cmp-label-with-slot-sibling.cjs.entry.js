'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const CmpLabelWithSlotSibling = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("label", null, index.h("slot", null), index.h("div", null, "Non-slotted text"))));
  }
};

exports.cmp_label_with_slot_sibling = CmpLabelWithSlotSibling;
