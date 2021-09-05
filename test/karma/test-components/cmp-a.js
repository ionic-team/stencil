import { attachShadow, h } from '@stencil/core/internal/client';

const LifecycleUnloadA = class extends HTMLElement {
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
    elm.textContent = 'cmp-a unload';
    this.results.appendChild(elm);
  }
  render() {
    return h(
      'main',
      null,
      h('header', null, 'cmp-a - top'),
      h('lifecycle-unload-b', null, 'cmp-a - middle'),
      h('footer', null, 'cmp-a - bottom')
    );
  }
  get el() {
    return this;
  }
};

export { LifecycleUnloadA as L };
