import { Host, h } from '@stencil/core';
export class CssCmp {
  render() {
    return (h(Host, null, h("div", { class: "css-entry" }, "Css Entry"), h("div", { class: "css-importee" }, "Css Importee"), h("hr", null)));
  }
  static get is() { return "css-cmp"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["css-entry.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["css-entry.css"]
    };
  }
}
