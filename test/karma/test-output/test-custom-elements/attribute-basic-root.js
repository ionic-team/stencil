import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp.js';

const AttributeBasicRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    this.url = new URL(window.location.href);
  }
  testClick() {
    const cmp = this.el.querySelector('attribute-basic');
    cmp.setAttribute('single', 'single-update');
    cmp.setAttribute('multi-word', 'multiWord-update');
    cmp.setAttribute('my-custom-attr', 'my-custom-attr-update');
    cmp.setAttribute('getter', 'getter-update');
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test"), h("attribute-basic", null), h("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname)));
  }
  get el() { return this; }
}, [0, "attribute-basic-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-basic-root", "attribute-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-basic-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBasicRoot$1);
      }
      break;
    case "attribute-basic":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const AttributeBasicRoot = AttributeBasicRoot$1;
const defineCustomElement = defineCustomElement$1;

export { AttributeBasicRoot, defineCustomElement };
