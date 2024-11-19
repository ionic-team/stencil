import { h } from '@stencil/core';
export class SvgClass {
  constructor() {
    this.hasColor = false;
  }
  testClick() {
    this.hasColor = !this.hasColor;
  }
  render() {
    return (h("div", null, h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test")), h("div", null, h("svg", { viewBox: "0 0 54 54", class: this.hasColor ? 'primary' : undefined }, h("circle", { cx: "8", cy: "18", width: "54", height: "8", r: "2", class: this.hasColor ? 'red' : undefined }), h("rect", { y: "2", width: "54", height: "8", rx: "2", class: this.hasColor ? 'blue' : undefined })))));
  }
  static get is() { return "svg-class"; }
  static get states() {
    return {
      "hasColor": {}
    };
  }
}
