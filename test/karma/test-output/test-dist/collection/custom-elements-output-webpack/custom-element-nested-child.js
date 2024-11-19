import { h } from '@stencil/core';
export class CustomElementNestedChild {
  render() {
    return (h("div", null, h("strong", null, "Child Nested Component Loaded!")));
  }
  static get is() { return "custom-element-nested-child"; }
  static get encapsulation() { return "shadow"; }
}
