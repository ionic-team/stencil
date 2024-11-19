import { h } from '@stencil/core';
export class SlotArrayComplex {
  render() {
    return [
      h("slot", { name: "start" }),
      h("section", null, h("slot", null)),
      h("slot", { name: "end" }),
    ];
  }
  static get is() { return "slot-array-complex"; }
}
