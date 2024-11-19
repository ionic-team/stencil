import { h } from '@stencil/core';
export class AttributeBasicRoot {
  constructor() {
    this.onClick = () => {
      this.wasClicked = 'Parent event';
    };
    this.wasClicked = '';
  }
  render() {
    return [h("span", { id: "result-root" }, this.wasClicked), h("listen-jsx", { onClick: this.onClick })];
  }
  static get is() { return "listen-jsx-root"; }
  static get states() {
    return {
      "wasClicked": {}
    };
  }
}
