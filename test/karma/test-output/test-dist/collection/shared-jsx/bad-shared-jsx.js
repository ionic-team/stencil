import { h } from '@stencil/core';
export class BadSharedJSX {
  render() {
    const sharedNode = h("div", null, "Do Not Share JSX Nodes!");
    return (h("div", null, sharedNode, sharedNode));
  }
  static get is() { return "bad-shared-jsx"; }
}
