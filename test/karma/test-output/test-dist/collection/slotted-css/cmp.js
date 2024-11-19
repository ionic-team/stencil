import { h, Host } from '@stencil/core';
export class SlottedCss {
  render() {
    return (h(Host, null, h("section", null, h("header", null, h("slot", { name: "header-slot-name" })), h("section", { class: "content" }, h("slot", null)), h("footer", null, h("slot", { name: "footer-slot-name" })))));
  }
  static get is() { return "slotted-css"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["cmp.css"]
    };
  }
}
