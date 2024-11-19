'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotLightScopedList = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [
      index.h("section", null, "These are my items:"),
      index.h("article", { class: "list-wrapper", style: { border: '2px solid green' } }, index.h("slot", null)),
      index.h("div", null, "That's it...."),
    ];
  }
};

exports.slot_light_scoped_list = SlotLightScopedList;
