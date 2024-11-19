'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotArrayComplexRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.endSlot = false;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return (index.h("main", null, index.h("slot-array-complex", null, index.h("header", { slot: "start" }, "slot - start"), "slot - default", this.endSlot ? index.h("footer", { slot: "end" }, "slot - end") : null)));
  }
};

exports.slot_array_complex_root = SlotArrayComplexRoot;
