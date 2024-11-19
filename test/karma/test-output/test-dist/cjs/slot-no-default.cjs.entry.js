'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotNoDefault = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("slot", { name: "a-slot-name" }), index.h("section", null, index.h("slot", { name: "footer-slot-name" })), index.h("div", null, index.h("article", null, index.h("slot", { name: "nav-slot-name" })))));
  }
};

exports.slot_no_default = SlotNoDefault;
