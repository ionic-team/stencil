'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpCss = ":host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot=\"header-slot-name\"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot=\"header-slot-name\"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}";

const SlottedCss = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("section", null, index.h("header", null, index.h("slot", { name: "header-slot-name" })), index.h("section", { class: "content" }, index.h("slot", null)), index.h("footer", null, index.h("slot", { name: "footer-slot-name" })))));
  }
};
SlottedCss.style = cmpCss;

exports.slotted_css = SlottedCss;
