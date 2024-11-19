import { h } from '@stencil/core';
export class SlotArrayBasic {
  render() {
    return [h("header", null, "Header"), h("slot", null), h("footer", null, "Footer")];
  }
  static get is() { return "slot-array-basic"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
}
