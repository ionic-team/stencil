import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotBasicOrderRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("slot-basic-order", null, h("content-a", null, "a"), h("content-b", null, "b"), h("content-c", null, "c")));
  }
};

export { SlotBasicOrderRoot as slot_basic_order_root };
