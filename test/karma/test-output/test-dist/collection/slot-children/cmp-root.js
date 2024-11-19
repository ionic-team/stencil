import { h } from '@stencil/core';
export class SlotChildrenRoot {
  render() {
    return (h("section", null, "ShadowRoot1", h("article", null, h("slot", null)), "ShadowRoot2"));
  }
  static get is() { return "slot-children-root"; }
  static get encapsulation() { return "shadow"; }
}
