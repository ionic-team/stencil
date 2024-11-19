import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const cmpCss = ":host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot=\"header-slot-name\"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot=\"header-slot-name\"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}";

const SlottedCss$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h(Host, null, h("section", null, h("header", null, h("slot", { name: "header-slot-name" })), h("section", { class: "content" }, h("slot", null)), h("footer", null, h("slot", { name: "footer-slot-name" })))));
  }
  static get style() { return cmpCss; }
}, [1, "slotted-css"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slotted-css"];
  components.forEach(tagName => { switch (tagName) {
    case "slotted-css":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlottedCss$1);
      }
      break;
  } });
}

const SlottedCss = SlottedCss$1;
const defineCustomElement = defineCustomElement$1;

export { SlottedCss, defineCustomElement };
