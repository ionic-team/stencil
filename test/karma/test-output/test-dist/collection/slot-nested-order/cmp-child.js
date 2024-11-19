import { h, Host } from '@stencil/core';
export class SlotNestedOrderChild {
  render() {
    return (h(Host, null, h("cmp-3", null, "3"), h("i", null, h("slot", null)), h("cmp-5", null, "5"), h("slot", { name: "end-slot-name" })));
  }
  static get is() { return "slot-nested-order-child"; }
}
