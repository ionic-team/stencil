import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$1 } from './cmp-b3.js';

const LifecycleUnloadA = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }
  disconnectedCallback() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-a unload';
    this.results.appendChild(elm);
  }
  render() {
    return (h("main", null, h("header", null, "cmp-a - top"), h("lifecycle-unload-b", null, "cmp-a - middle"), h("footer", null, "cmp-a - bottom")));
  }
  get el() { return this; }
}, [1, "lifecycle-unload-a"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-unload-a", "lifecycle-unload-b"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-unload-a":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleUnloadA);
      }
      break;
    case "lifecycle-unload-b":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { LifecycleUnloadA as L, defineCustomElement as d };
