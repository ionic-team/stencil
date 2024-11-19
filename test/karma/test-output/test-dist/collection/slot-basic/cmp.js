import { h } from '@stencil/core';
export class SlotBasic {
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
  static get is() { return "slot-basic"; }
}
