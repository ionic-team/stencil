import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const delegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}";

const DelegatesFocus = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get style() { return delegatesFocusCss; }
}, [1, "no-delegates-focus"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["no-delegates-focus"];
  components.forEach(tagName => { switch (tagName) {
    case "no-delegates-focus":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DelegatesFocus);
      }
      break;
  } });
}

const NoDelegatesFocus = DelegatesFocus;
const defineCustomElement = defineCustomElement$1;

export { NoDelegatesFocus, defineCustomElement };
