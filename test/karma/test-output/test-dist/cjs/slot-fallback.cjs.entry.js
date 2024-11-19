'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotFallback = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.inc = 0;
  }
  render() {
    return (index.h("div", null, index.h("hr", null), index.h("slot", { name: "start" }, "slot start fallback ", this.inc), index.h("section", null, index.h("slot", null, "slot default fallback ", this.inc)), index.h("article", null, index.h("span", null, index.h("slot", { name: "end" }, "slot end fallback ", this.inc)))));
  }
};

exports.slot_fallback = SlotFallback;
