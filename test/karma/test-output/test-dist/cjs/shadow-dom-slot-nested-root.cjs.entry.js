'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomSlotNestedRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    const nested = [0, 1, 2].map((i) => {
      return index.h("shadow-dom-slot-nested", { i: i }, "light dom: ", i);
    });
    return [index.h("section", null, "shadow-dom-slot-nested"), index.h("article", null, nested)];
  }
};
ShadowDomSlotNestedRoot.style = ":host {\n      color: green;\n      font-weight: bold;\n    }";

exports.shadow_dom_slot_nested_root = ShadowDomSlotNestedRoot;
