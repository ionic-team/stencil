import { h, Host } from '@stencil/core';
export class CssVariablesNoEncapsulation {
  render() {
    return (h(Host, null, h("div", { class: "black-local" }, "No encapsulation: Black background"), h("div", { class: "black-global" }, "No encapsulation: Black background (global style)"), h("div", { class: "yellow-global" }, "No encapsulation: Yellow background (global link)")));
  }
  static get is() { return "css-variables-no-encapsulation"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp-no-encapsulation.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp-no-encapsulation.css"]
    };
  }
}
