'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotHtml = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.inc = 0;
  }
  render() {
    return (index.h("div", null, index.h("hr", null), index.h("article", null, index.h("span", null, index.h("slot", { name: "start" }))), index.h("slot", null), index.h("section", null, index.h("slot", { name: "end" }))));
  }
};

exports.slot_html = SlotHtml;
