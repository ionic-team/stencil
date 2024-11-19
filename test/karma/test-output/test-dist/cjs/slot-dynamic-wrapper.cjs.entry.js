'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotDynamicWrapper = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.tag = 'section';
  }
  render() {
    return (index.h(this.tag, null, index.h("slot", null)));
  }
};

exports.slot_dynamic_wrapper = SlotDynamicWrapper;
