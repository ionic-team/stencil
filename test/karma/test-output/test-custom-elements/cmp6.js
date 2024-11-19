import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const ShadowDomBasic = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return [h("div", null, "shadow"), h("slot", null)];
  }
  static get style() { return "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }"; }
}, [1, "shadow-dom-basic"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomBasic);
      }
      break;
  } });
}

export { ShadowDomBasic as S, defineCustomElement as d };
