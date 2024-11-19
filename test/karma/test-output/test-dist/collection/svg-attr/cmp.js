import { h } from '@stencil/core';
export class SvgAttr {
  constructor() {
    this.isOpen = false;
  }
  testClick() {
    this.isOpen = !this.isOpen;
  }
  render() {
    return (h("div", null, h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test")), h("div", null, this.isOpen ? (h("svg", { viewBox: "0 0 54 54" }, h("rect", { transform: "rotate(45 27 27)", y: "22", width: "54", height: "10", rx: "2", stroke: "yellow", "stroke-width": "5px", "stroke-dasharray": "8 4" }))) : (h("svg", { viewBox: "0 0 54 54" }, h("rect", { y: "0", width: "54", height: "10", rx: "2", stroke: "blue", "stroke-width": "2px", "stroke-dasharray": "4 2" }))))));
  }
  static get is() { return "svg-attr"; }
  static get states() {
    return {
      "isOpen": {}
    };
  }
}
