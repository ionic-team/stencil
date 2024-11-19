import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const CmpLabelWithSlotSibling = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("label", null, h("slot", null), h("div", null, "Non-slotted text"))));
  }
};

export { CmpLabelWithSlotSibling as cmp_label_with_slot_sibling };
