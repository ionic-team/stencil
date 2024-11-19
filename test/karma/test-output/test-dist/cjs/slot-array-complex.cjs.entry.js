'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotArrayComplex = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [
      index.h("slot", { name: "start" }),
      index.h("section", null, index.h("slot", null)),
      index.h("slot", { name: "end" }),
    ];
  }
};

exports.slot_array_complex = SlotArrayComplex;
