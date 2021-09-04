import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const cmpCss = ":host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot=\"header-slot-name\"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot=\"header-slot-name\"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}";

const SlottedCss$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h(Host, null, h("section", null, h("header", null, h("slot", { name: "header-slot-name" })), h("section", { class: "content" }, h("slot", null)), h("footer", null, h("slot", { name: "footer-slot-name" })))));
  }
  static get style() { return cmpCss; }
};

const SlottedCss = /*@__PURE__*/proxyCustomElement(SlottedCss$1, [1,"slotted-css"]);
const components = ['slotted-css', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slotted-css':
        tagName = 'slotted-css';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlottedCss);
        }
        break;

    }
  });
};

export { SlottedCss, defineCustomElement };
