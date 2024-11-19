import { r as registerInstance, h, g as getElement } from './index-a2c0d171.js';

const LifecycleUnloadB = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
  get el() { return getElement(this); }
};

export { LifecycleUnloadB as lifecycle_unload_b };
