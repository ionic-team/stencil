import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp7.js';

const ShadowDomModeRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showRed = false;
  }
  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }
  render() {
    return (h("div", null, h("shadow-dom-mode", { id: "blue", colormode: "blue" }), this.showRed ? h("shadow-dom-mode", { id: "red" }) : null));
  }
}, [0, "shadow-dom-mode-root", {
    "showRed": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["shadow-dom-mode-root", "shadow-dom-mode"];
  components.forEach(tagName => { switch (tagName) {
    case "shadow-dom-mode-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ShadowDomModeRoot$1);
      }
      break;
    case "shadow-dom-mode":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ShadowDomModeRoot = ShadowDomModeRoot$1;
const defineCustomElement = defineCustomElement$1;

export { ShadowDomModeRoot, defineCustomElement };
