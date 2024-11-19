import { Host, h } from '@stencil/core';
export class StencilSibling {
  render() {
    return (h(Host, null, h("sibling-root", null, "sibling-light-dom")));
  }
  static get is() { return "stencil-sibling"; }
}
