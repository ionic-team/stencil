import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}";

const CustomElementsNoDelegatesFocus$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h(Host, null, h("input", null)));
  }
  static get style() { return sharedDelegatesFocusCss; }
}, [1, "custom-elements-no-delegates-focus"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-elements-no-delegates-focus"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-elements-no-delegates-focus":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementsNoDelegatesFocus$1);
      }
      break;
  } });
}

const CustomElementsNoDelegatesFocus = CustomElementsNoDelegatesFocus$1;
const defineCustomElement = defineCustomElement$1;

export { CustomElementsNoDelegatesFocus, defineCustomElement };
