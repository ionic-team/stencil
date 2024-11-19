import { Host, h } from '@stencil/core';
export class CmpLabel {
  render() {
    return (h(Host, null, h("label", null, h("slot", null))));
  }
  static get is() { return "cmp-label"; }
  static get encapsulation() { return "scoped"; }
}
