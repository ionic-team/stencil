import { h, Host } from '@stencil/core';
export class SlotNestedOrderParent {
  render() {
    return (h(Host, null, h("slot", null), h("slot-nested-order-child", null, h("slot", { name: "italic-slot-name" }), h("cmp-6", { slot: "end-slot-name" }, "6"))));
  }
  static get is() { return "slot-nested-order-parent"; }
}
