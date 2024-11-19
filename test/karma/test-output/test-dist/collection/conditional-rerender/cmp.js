import { h } from '@stencil/core';
export class ConditionalRerender {
  render() {
    return (h("main", null, h("slot", null), h("nav", null, "Nav")));
  }
  static get is() { return "conditional-rerender"; }
}
