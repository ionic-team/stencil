import { h } from '@stencil/core';
export class SlotArrayTop {
  render() {
    return [h("span", null, "Content should be on top"), h("slot", null)];
  }
  static get is() { return "slot-array-top"; }
  static get encapsulation() { return "shadow"; }
}
