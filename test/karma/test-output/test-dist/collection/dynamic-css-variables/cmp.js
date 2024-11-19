import { h } from '@stencil/core';
export class DynamicCssVariables {
  constructor() {
    this.bgColor = 'white';
  }
  getBackgroundStyle() {
    return this.bgColor && this.bgColor !== 'white' ? { background: this.bgColor, '--font-color': 'white' } : {};
  }
  changeColor() {
    if (this.bgColor === 'white') {
      this.bgColor = 'red';
    }
    else {
      this.bgColor = 'white';
    }
  }
  render() {
    return [
      h("header", { style: this.getBackgroundStyle() }, "Dynamic CSS Variables!!"),
      h("main", null, h("p", null, h("button", { onClick: this.changeColor.bind(this) }, "Change Color"))),
    ];
  }
  static get is() { return "dynamic-css-variable"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
  static get states() {
    return {
      "bgColor": {}
    };
  }
}
