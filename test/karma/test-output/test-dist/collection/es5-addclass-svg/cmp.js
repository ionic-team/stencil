import { h } from '@stencil/core';
export class SvgAddClass {
  render() {
    return (h("div", null, h("svg", { viewBox: "0 0 8 8", class: "existing-css-class" }, h("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
  }
  static get is() { return "es5-addclass-svg"; }
  static get encapsulation() { return "shadow"; }
}
