'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomSlotNested = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.i = undefined;
  }
  render() {
    return [
      index.h("header", null, "shadow dom: ", this.i),
      index.h("footer", null, index.h("slot", null)),
    ];
  }
};
ShadowDomSlotNested.style = "header {\n      color: red;\n    }";

exports.shadow_dom_slot_nested = ShadowDomSlotNested;
