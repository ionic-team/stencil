'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpCss = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";

const SlotArrayBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [index.h("header", null, "Header"), index.h("slot", null), index.h("footer", null, "Footer")];
  }
};
SlotArrayBasic.style = cmpCss;

exports.slot_array_basic = SlotArrayBasic;
