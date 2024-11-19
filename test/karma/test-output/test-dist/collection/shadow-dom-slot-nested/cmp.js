import { h } from '@stencil/core';
export class ShadowDomSlotNested {
  constructor() {
    this.i = undefined;
  }
  render() {
    return [
      h("header", null, "shadow dom: ", this.i),
      h("footer", null, h("slot", null)),
    ];
  }
  static get is() { return "shadow-dom-slot-nested"; }
  static get encapsulation() { return "shadow"; }
  static get styles() { return "header {\n      color: red;\n    }"; }
  static get properties() {
    return {
      "i": {
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
        "attribute": "i",
        "reflect": false
      }
    };
  }
}
