import { h } from '@stencil/core';
export class ReparentStyleWithVars {
  render() {
    return h("div", { class: "css-entry" }, "With CSS Vars");
  }
  static get is() { return "reparent-style-with-vars"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["reparent-style-with-vars.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["reparent-style-with-vars.css"]
    };
  }
}
