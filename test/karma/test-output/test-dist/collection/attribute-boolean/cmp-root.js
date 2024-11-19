import { h } from '@stencil/core';
export class AttributeBooleanRoot {
  constructor() {
    this.state = false;
  }
  async toggleState() {
    this.state = !this.state;
  }
  hostData() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? 'hello' : null,
      'aria-hidden': `${this.state}`,
      fixedtrue: 'true',
      fixedfalse: 'false',
      'no-appear': undefined,
      'no-appear2': false,
    };
  }
  render() {
    const AttributeBoolean = 'attribute-boolean';
    return [
      h("button", { onClick: this.toggleState.bind(this) }, "Toggle attributes"),
      h(AttributeBoolean, { boolState: this.state, strState: this.state, noreflect: this.state, tappable: this.state, "aria-hidden": `${this.state}` }),
    ];
  }
  static get is() { return "attribute-boolean-root"; }
  static get states() {
    return {
      "state": {}
    };
  }
  static get methods() {
    return {
      "toggleState": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
}
