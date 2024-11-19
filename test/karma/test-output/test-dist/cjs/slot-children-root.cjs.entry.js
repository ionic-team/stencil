'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotChildrenRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("section", null, "ShadowRoot1", index.h("article", null, index.h("slot", null)), "ShadowRoot2"));
  }
};

exports.slot_children_root = SlotChildrenRoot;
