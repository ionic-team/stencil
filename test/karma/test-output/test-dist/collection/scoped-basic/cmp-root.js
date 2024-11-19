import { h } from '@stencil/core';
export class ScopedBasicRoot {
  render() {
    return (h("scoped-basic", null, h("span", null, "light")));
  }
  static get is() { return "scoped-basic-root"; }
  static get encapsulation() { return "scoped"; }
  static get originalStyleUrls() {
    return {
      "md": ["cmp-root-md.css"]
    };
  }
  static get styleUrls() {
    return {
      "md": ["cmp-root-md.css"]
    };
  }
}
