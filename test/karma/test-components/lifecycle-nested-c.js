import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpc = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  async componentWillLoad() {
    output('componentWillLoad-c');
  }
  componentDidLoad() {
    output('componentDidLoad-c');
  }
  render() {
    return h(Host, null, h('div', null, 'hello'));
  }
};

const LifecycleNestedC = /*@__PURE__*/ proxyCustomElement(Cmpc, [1, 'lifecycle-nested-c']);
const components = ['lifecycle-nested-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'lifecycle-nested-c':
        tagName = 'lifecycle-nested-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, LifecycleNestedC);
        }
        break;
    }
  });
};

export { LifecycleNestedC, defineCustomElement };
