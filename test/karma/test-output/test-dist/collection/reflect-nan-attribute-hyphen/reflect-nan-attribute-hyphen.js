import { h } from '@stencil/core';
export class ReflectNanAttributeHyphen {
  constructor() {
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.valNum = undefined;
  }
  render() {
    this.renderCount += 1;
    return h("div", null, "reflect-nan-attribute-hyphen Render Count: ", this.renderCount);
  }
  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
  static get is() { return "reflect-nan-attribute-hyphen"; }
  static get encapsulation() { return "shadow"; }
  static get properties() {
    return {
      "valNum": {
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
        "attribute": "val-num",
        "reflect": true
      }
    };
  }
}
