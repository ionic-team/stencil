import { Host, h } from '@stencil/core';
export class SassCmp {
  render() {
    return (h(Host, null, h("div", { class: "sass-entry" }, "Sass Entry"), h("div", { class: "sass-importee" }, "Sass Importee"), h("div", { class: "css-importee" }, "Css Importee"), h("button", { class: "btn btn-primary" }, "Bootstrap"), h("hr", null)));
  }
  static get is() { return "sass-cmp"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["sass-entry.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["sass-entry.css"]
    };
  }
}
