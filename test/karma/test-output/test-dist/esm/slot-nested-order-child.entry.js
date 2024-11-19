import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const SlotNestedOrderChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("cmp-3", null, "3"), h("i", null, h("slot", null)), h("cmp-5", null, "5"), h("slot", { name: "end-slot-name" })));
  }
};

export { SlotNestedOrderChild as slot_nested_order_child };
