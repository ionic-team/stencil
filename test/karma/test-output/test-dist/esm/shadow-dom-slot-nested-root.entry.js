import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomSlotNestedRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const nested = [0, 1, 2].map((i) => {
      return h("shadow-dom-slot-nested", { i: i }, "light dom: ", i);
    });
    return [h("section", null, "shadow-dom-slot-nested"), h("article", null, nested)];
  }
};
ShadowDomSlotNestedRoot.style = ":host {\n      color: green;\n      font-weight: bold;\n    }";

export { ShadowDomSlotNestedRoot as shadow_dom_slot_nested_root };
