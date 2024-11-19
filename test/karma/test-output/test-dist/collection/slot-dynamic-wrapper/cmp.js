import { h } from '@stencil/core';
export class SlotDynamicWrapper {
  constructor() {
    this.tag = 'section';
  }
  render() {
    return (h(this.tag, null, h("slot", null)));
  }
  static get is() { return "slot-dynamic-wrapper"; }
  static get properties() {
    return {
      "tag": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "tag",
        "reflect": false,
        "defaultValue": "'section'"
      }
    };
  }
}
