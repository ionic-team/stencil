import { attachShadow, h } from '@stencil/core/internal/client';

const LifecycleUnloadB = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
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
};

export { LifecycleUnloadB as L };
