import { Host, h } from '@stencil/core';
export class StaticStyles {
  render() {
    return (h(Host, null, h("h1", null, "static get styles()")));
  }
  static get styles() {
    return `
      h1 {
        color: red;
      }
    `;
  }
  static get is() { return "static-styles"; }
}
