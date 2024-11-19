import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const LifecycleUnloadB = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
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
    elm.textContent = 'cmp-b unload';
    this.results.appendChild(elm);
  }
  render() {
    return [
      h("article", null, "cmp-b - top"),
      h("section", null, h("slot", null)),
      h("nav", null, "cmp-b - bottom"),
    ];
  }
  get el() { return this; }
}, [1, "lifecycle-unload-b"]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["lifecycle-unload-b"];
  components.forEach(tagName => { switch (tagName) {
    case "lifecycle-unload-b":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LifecycleUnloadB);
      }
      break;
  } });
}

export { LifecycleUnloadB as L, defineCustomElement as d };
