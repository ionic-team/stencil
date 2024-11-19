import { Host, h } from '@stencil/core';
export class CmpLabelWithSlotSibling {
  render() {
    return (h(Host, null, h("label", null, h("slot", null), h("div", null, "Non-slotted text"))));
  }
  static get is() { return "cmp-label-with-slot-sibling"; }
  static get encapsulation() { return "scoped"; }
}
