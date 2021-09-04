import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { o as output } from './output.js';

const Cmpb = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  async componentWillLoad() {
    output('componentWillLoad-b');
  }
  async componentDidLoad() {
    output('componentDidLoad-b');
  }
  render() {
    return h("slot", null);
  }
};

const LifecycleNestedB = /*@__PURE__*/proxyCustomElement(Cmpb, [1,"lifecycle-nested-b"]);
const components = ['lifecycle-nested-b', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'lifecycle-nested-b':
        tagName = 'lifecycle-nested-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, LifecycleNestedB);
        }
        break;

    }
  });
};

export { LifecycleNestedB, defineCustomElement };
