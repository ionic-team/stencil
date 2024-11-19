import { h } from '@stencil/core';
export class FactoryJSX {
  getJsxNode() {
    return h("div", null, "Factory JSX");
  }
  render() {
    return (h("div", null, this.getJsxNode(), this.getJsxNode()));
  }
  static get is() { return "factory-jsx"; }
}
