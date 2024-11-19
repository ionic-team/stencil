import { proxyCustomElement, HTMLElement, getMode, h } from '@stencil/core/internal/client';

const modeBlueCss = ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}";

const modeRedCss = ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}";

const ShadowDomMode = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.mode = getMode(this);
  }
  render() {
    return h("div", null, this.mode);
  }
  static get style() { return {
    blue: modeBlueCss,
    red: modeRedCss
  }; }
}, [33, "shadow-dom-mode"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-mode"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-mode":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomMode);
      }
      break;
  } });
}

export { ShadowDomMode as S, defineCustomElement as d };
