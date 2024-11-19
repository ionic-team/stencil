import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const SlotNestedOrderParent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null), h("slot-nested-order-child", null, h("slot", { name: "italic-slot-name" }), h("cmp-6", { slot: "end-slot-name" }, "6"))));
  }
};

export { SlotNestedOrderParent as slot_nested_order_parent };
