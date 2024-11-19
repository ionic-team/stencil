import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotChildrenRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("section", null, "ShadowRoot1", h("article", null, h("slot", null)), "ShadowRoot2"));
  }
};

export { SlotChildrenRoot as slot_children_root };
