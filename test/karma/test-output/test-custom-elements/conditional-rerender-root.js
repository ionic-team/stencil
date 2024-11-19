import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp2.js';

const ConditionalRerenderRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showContent = false;
    this.showFooter = false;
  }
  componentDidLoad() {
    this.showFooter = true;
    setTimeout(() => (this.showContent = true), 20);
  }
  render() {
    return (h("conditional-rerender", null, h("header", null, "Header"), this.showContent ? h("section", null, "Content") : null, this.showFooter ? h("footer", null, "Footer") : null));
  }
}, [0, "conditional-rerender-root", {
    "showContent": [32],
    "showFooter": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["conditional-rerender-root", "conditional-rerender"];
  components.forEach(tagName => { switch (tagName) {
    case "conditional-rerender-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ConditionalRerenderRoot$1);
      }
      break;
    case "conditional-rerender":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ConditionalRerenderRoot = ConditionalRerenderRoot$1;
const defineCustomElement = defineCustomElement$1;

export { ConditionalRerenderRoot, defineCustomElement };
