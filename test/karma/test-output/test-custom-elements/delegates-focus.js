import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const delegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}";

const DelegatesFocus$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get delegatesFocus() { return true; }
  static get style() { return delegatesFocusCss; }
}, [17, "delegates-focus"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["delegates-focus"];
  components.forEach(tagName => { switch (tagName) {
    case "delegates-focus":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DelegatesFocus$1);
      }
      break;
  } });
}

const DelegatesFocus = DelegatesFocus$1;
const defineCustomElement = defineCustomElement$1;

export { DelegatesFocus, defineCustomElement };
