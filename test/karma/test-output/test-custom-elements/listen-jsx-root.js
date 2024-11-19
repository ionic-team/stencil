import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp3.js';

const AttributeBasicRoot = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.onClick = () => {
      this.wasClicked = 'Parent event';
    };
    this.wasClicked = '';
  }
  render() {
    return [h("span", { id: "result-root" }, this.wasClicked), h("listen-jsx", { onClick: this.onClick })];
  }
}, [0, "listen-jsx-root", {
    "wasClicked": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["listen-jsx-root", "listen-jsx"];
  components.forEach(tagName => { switch (tagName) {
    case "listen-jsx-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBasicRoot);
      }
      break;
    case "listen-jsx":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const ListenJsxRoot = AttributeBasicRoot;
const defineCustomElement = defineCustomElement$1;

export { ListenJsxRoot, defineCustomElement };
