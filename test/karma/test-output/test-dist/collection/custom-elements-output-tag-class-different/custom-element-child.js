import { h } from '@stencil/core';
export class CustomElementChild {
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!")));
  }
  static get is() { return "custom-element-child-different-name-than-class"; }
  static get encapsulation() { return "shadow"; }
}
