import { h, Host } from '@stencil/core';
export class CssVariablesRoot {
  constructor() {
    this.isGreen = false;
  }
  render() {
    return (h(Host, { class: {
        'set-green': this.isGreen,
      } }, h("div", { class: "inner-div" }, "Shadow: ", this.isGreen ? 'Green' : 'Red', " background"), h("div", { class: "black-global-shadow" }, "Shadow: Black background (global)"), h("button", { onClick: () => {
        this.isGreen = !this.isGreen;
      } }, "Toggle color")));
  }
  static get is() { return "css-variables-shadow-dom"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp-shadow-dom.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp-shadow-dom.css"]
    };
  }
  static get states() {
    return {
      "isGreen": {}
    };
  }
}
