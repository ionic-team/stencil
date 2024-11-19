import { h } from '@stencil/core';
export class DynamicListScopedComponent {
  constructor() {
    this.items = [];
  }
  render() {
    return (h("slot-light-scoped-list", null, this.items.map((item) => (h("div", null, item)))));
  }
  static get is() { return "slot-dynamic-scoped-list"; }
  static get encapsulation() { return "scoped"; }
  static get properties() {
    return {
      "items": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Array<string>",
          "resolved": "string[]",
          "references": {
            "Array": {
              "location": "global"
            }
          }
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
