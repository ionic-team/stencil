import { h } from '@stencil/core';
export class ReparentStyleNoVars {
  render() {
    return h("div", { class: "css-entry" }, "No CSS Variables");
  }
  static get is() { return "reparent-style-no-vars"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["reparent-style-no-vars.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["reparent-style-no-vars.css"]
    };
  }
}
