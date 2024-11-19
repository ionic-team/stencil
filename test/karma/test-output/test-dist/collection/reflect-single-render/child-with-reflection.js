import { h } from '@stencil/core';
export class ChildWithReflection {
  constructor() {
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.val = undefined;
  }
  render() {
    this.renderCount += 1;
    return (h("div", null, h("div", null, "Child Render Count: ", this.renderCount), h("input", { step: this.val })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
  static get is() { return "child-with-reflection"; }
  static get encapsulation() { return "shadow"; }
  static get properties() {
    return {
      "val": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "number | any",
          "resolved": "any",
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
        "attribute": "val",
        "reflect": true
      }
    };
  }
}
