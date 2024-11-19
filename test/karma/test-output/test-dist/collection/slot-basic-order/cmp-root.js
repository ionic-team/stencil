import { h } from '@stencil/core';
export class SlotBasicOrderRoot {
  render() {
    return (h("slot-basic-order", null, h("content-a", null, "a"), h("content-b", null, "b"), h("content-c", null, "c")));
  }
  static get is() { return "slot-basic-order-root"; }
}
