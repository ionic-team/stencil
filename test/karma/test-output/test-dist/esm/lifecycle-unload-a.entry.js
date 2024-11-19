import { r as registerInstance, h, g as getElement } from './index-a2c0d171.js';

const LifecycleUnloadA = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
  get el() { return getElement(this); }
};

export { LifecycleUnloadA as lifecycle_unload_a };
