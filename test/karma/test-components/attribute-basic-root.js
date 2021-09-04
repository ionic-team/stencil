import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { A as AttributeBasic } from './cmp.js';

const AttributeBasicRoot$1 = class extends HTMLElement {
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
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this) }, "Test"), h("attribute-basic", null), h("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname)));
  }
  get el() { return this; }
};

const AttributeBasicRoot = /*@__PURE__*/proxyCustomElement(AttributeBasicRoot$1, [0,"attribute-basic-root"]);
const components = ['attribute-basic-root', 'attribute-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'attribute-basic-root':
        tagName = 'attribute-basic-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, AttributeBasicRoot);
        }
        break;

      case 'attribute-basic':
        tagName = 'attribute-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const AttributeBasic$1 = /*@__PURE__*/proxyCustomElement(AttributeBasic, [0,"attribute-basic-root"]);
          customElements.define(tagName, AttributeBasic$1);
        }
        break;

    }
  });
};

export { AttributeBasicRoot, defineCustomElement };
