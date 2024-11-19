import { h } from '@stencil/core';
export class InputBasicRoot {
  constructor() {
    this.value = undefined;
  }
  render() {
    return (h("div", null, h("p", null, "Value: ", h("span", { class: "value" }, this.value)), h("input", { type: "text", value: this.value, onInput: (ev) => (this.value = ev.target.value) })));
  }
  static get is() { return "input-basic-root"; }
  static get properties() {
    return {
      "value": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "string",
          "resolved": "string",
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
        "attribute": "value",
        "reflect": false
      }
    };
  }
  static get elementRef() { return "el"; }
}
