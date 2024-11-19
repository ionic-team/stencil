import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const cmpCss = ":host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot=\"header-slot-name\"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot=\"header-slot-name\"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}";

const SlottedCss = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("section", null, h("header", null, h("slot", { name: "header-slot-name" })), h("section", { class: "content" }, h("slot", null)), h("footer", null, h("slot", { name: "footer-slot-name" })))));
  }
};
SlottedCss.style = cmpCss;

export { SlottedCss as slotted_css };
