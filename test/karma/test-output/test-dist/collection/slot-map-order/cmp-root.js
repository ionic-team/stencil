import { h } from '@stencil/core';
export class SlotMapOrderRoot {
  render() {
    const items = ['a', 'b', 'c'];
    return (h("slot-map-order", null, items.map((item) => (h("div", null, h("input", { type: "text", value: item }))))));
  }
  static get is() { return "slot-map-order-root"; }
}
