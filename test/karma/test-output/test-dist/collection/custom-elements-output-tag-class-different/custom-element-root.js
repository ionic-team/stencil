import { h } from '@stencil/core';
export class CustomElementRoot {
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("custom-element-child-different-name-than-class", null)));
  }
  static get is() { return "custom-element-root-different-name-than-class"; }
  static get encapsulation() { return "shadow"; }
}
