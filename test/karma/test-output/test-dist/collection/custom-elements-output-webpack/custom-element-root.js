import { h } from '@stencil/core';
export class CustomElementRoot {
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("h3", null, "Child Component Loaded?"), h("custom-element-child", null)));
  }
  static get is() { return "custom-element-root"; }
  static get encapsulation() { return "shadow"; }
}
