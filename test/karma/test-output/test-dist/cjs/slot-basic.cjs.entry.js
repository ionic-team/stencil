'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("header", null, index.h("section", null, index.h("article", null, index.h("slot", null)))));
  }
};

exports.slot_basic = SlotBasic;
