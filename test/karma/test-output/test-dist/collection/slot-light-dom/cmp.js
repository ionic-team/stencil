import { h } from '@stencil/core';
export class SlotLightDomContent {
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
  static get is() { return "slot-light-dom-content"; }
}
