import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpa = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  async componentWillLoad() {
    output('componentWillLoad-a');
  }
  async componentDidLoad() {
    output('componentDidLoad-a');
  }
  render() {
    return h('slot', null);
  }
};

const LifecycleNestedA = /*@__PURE__*/ proxyCustomElement(Cmpa, [1, 'lifecycle-nested-a']);
const components = ['lifecycle-nested-a'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-nested-a':
        tagName = 'lifecycle-nested-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleNestedA);
        }
        break;
    }
  });
};

export { LifecycleNestedA, defineCustomElement };
