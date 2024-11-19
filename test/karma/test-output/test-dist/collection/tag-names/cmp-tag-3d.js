import { h } from '@stencil/core';
export class CmpTag3d {
  render() {
    return h("div", null, "tag-3d-component");
  }
  static get is() { return "tag-3d-component"; }
}
