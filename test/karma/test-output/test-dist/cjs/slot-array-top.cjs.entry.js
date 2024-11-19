'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotArrayTop = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [index.h("span", null, "Content should be on top"), index.h("slot", null)];
  }
};

exports.slot_array_top = SlotArrayTop;
