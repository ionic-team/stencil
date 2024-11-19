import { h } from '@stencil/core';
export class InitCssRoot {
  render() {
    return [h("div", { id: "relative" }), h("div", { id: "relativeToRoot" }), h("div", { id: "absolute" })];
  }
  static get is() { return "init-css-root"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp-root.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp-root.css"]
    };
  }
}
