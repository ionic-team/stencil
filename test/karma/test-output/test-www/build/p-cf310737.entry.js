import { r as o, h as e, e as t } from "./p-55339060.js";

const l = class {
  constructor(e) {
    o(this, e);
  }
  render() {
    return e(t, null, e("section", null, e("header", null, e("slot", {
      name: "header-slot-name"
    })), e("section", {
      class: "content"
    }, e("slot", null)), e("footer", null, e("slot", {
      name: "footer-slot-name"
    }))));
  }
};

l.style = ':host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot="header-slot-name"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot="header-slot-name"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}';

export { l as slotted_css }