import { h } from '@stencil/core';
export class SlotBasicOrder {
  render() {
    return h("slot", null);
  }
  static get is() { return "slot-basic-order"; }
}
