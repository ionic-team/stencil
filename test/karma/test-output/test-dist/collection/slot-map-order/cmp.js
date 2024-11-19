import { h } from '@stencil/core';
export class SlotMapOrder {
  render() {
    return h("slot", null);
  }
  static get is() { return "slot-map-order"; }
}
