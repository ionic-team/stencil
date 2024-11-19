import { h } from '@stencil/core';
export class KeyReorder {
  constructor() {
    this.num = undefined;
  }
  render() {
    return h("div", null, this.num);
  }
  static get is() { return "key-reorder"; }
  static get properties() {
    return {
      "num": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "num",
        "reflect": false
      }
    };
  }
}
