import { h } from '@stencil/core';
export class ShadowDomArrayRoot {
  constructor() {
    this.values = [0];
  }
  addValue() {
    this.values = [...this.values, this.values.length];
  }
  render() {
    return (h("div", null, h("button", { onClick: this.addValue.bind(this) }, "Add Value"), h("shadow-dom-array", { values: this.values, class: "results1" })));
  }
  static get is() { return "shadow-dom-array-root"; }
  static get states() {
    return {
      "values": {}
    };
  }
}
