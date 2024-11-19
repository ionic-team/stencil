import { h } from '@stencil/core';
export class SlotHtml {
  constructor() {
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("article", null, h("span", null, h("slot", { name: "start" }))), h("slot", null), h("section", null, h("slot", { name: "end" }))));
  }
  static get is() { return "slot-html"; }
  static get properties() {
    return {
      "inc": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
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
        "attribute": "inc",
        "reflect": false,
        "defaultValue": "0"
      }
    };
  }
}
