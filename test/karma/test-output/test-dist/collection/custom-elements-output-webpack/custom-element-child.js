import { h } from '@stencil/core';
export class CustomElementChild {
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!"), h("h3", null, "Child Nested Component?"), h("custom-element-nested-child", null)));
  }
  static get is() { return "custom-element-child"; }
  static get encapsulation() { return "shadow"; }
}
