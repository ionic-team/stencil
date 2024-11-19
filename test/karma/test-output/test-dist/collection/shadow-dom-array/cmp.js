import { h } from '@stencil/core';
export class ShadowDomArray {
  constructor() {
    this.values = [];
  }
  render() {
    return this.values.map((v) => h("div", null, v));
  }
  static get is() { return "shadow-dom-array"; }
  static get encapsulation() { return "shadow"; }
  static get properties() {
    return {
      "values": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "number[]",
          "resolved": "number[]",
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
        "defaultValue": "[]"
      }
    };
  }
}
