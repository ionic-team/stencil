import { h } from '@stencil/core';
export class SlotFallback {
  constructor() {
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("slot", { name: "start" }, "slot start fallback ", this.inc), h("section", null, h("slot", null, "slot default fallback ", this.inc)), h("article", null, h("span", null, h("slot", { name: "end" }, "slot end fallback ", this.inc)))));
  }
  static get is() { return "slot-fallback"; }
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
