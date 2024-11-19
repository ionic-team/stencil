import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp6.js';

const ShadowDomBasicRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("shadow-dom-basic", null, h("div", null, "light")));
  }
  static get style() { return "div {\n      background: rgb(255, 255, 0);\n    }"; }
}, [1, "shadow-dom-basic-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-basic-root", "shadow-dom-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-basic-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomBasicRoot$1);
      }
      break;
    case "shadow-dom-basic":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ShadowDomBasicRoot = ShadowDomBasicRoot$1;
const defineCustomElement = defineCustomElement$1;

export { ShadowDomBasicRoot, defineCustomElement };
