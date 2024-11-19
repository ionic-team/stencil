import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp4.js';

const cmpRootMdCss = ".sc-scoped-basic-root-md-h{color:white}";

const ScopedBasicRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("scoped-basic", null, h("span", null, "light")));
  }
  static get style() { return {
    md: cmpRootMdCss
  }; }
}, [34, "scoped-basic-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["scoped-basic-root", "scoped-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "scoped-basic-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ScopedBasicRoot$1);
      }
      break;
    case "scoped-basic":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ScopedBasicRoot = ScopedBasicRoot$1;
const defineCustomElement = defineCustomElement$1;

export { ScopedBasicRoot, defineCustomElement };
