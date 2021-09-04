import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { C as ConditionalRerender } from './cmp2.js';

const ConditionalRerenderRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showContent = false;
    this.showFooter = false;
  }
  componentDidLoad() {
    this.showFooter = true;
    setTimeout(() => (this.showContent = true), 20);
  }
  render() {
    return (h("conditional-rerender", null, h("header", null, "Header"), this.showContent ? h("section", null, "Content") : null, this.showFooter ? h("footer", null, "Footer") : null));
  }
};

const ConditionalRerenderRoot = /*@__PURE__*/proxyCustomElement(ConditionalRerenderRoot$1, [0,"conditional-rerender-root",{"showContent":[32],"showFooter":[32]}]);
const components = ['conditional-rerender-root', 'conditional-rerender', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'conditional-rerender-root':
        tagName = 'conditional-rerender-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ConditionalRerenderRoot);
        }
        break;

      case 'conditional-rerender':
        tagName = 'conditional-rerender';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ConditionalRerender$1 = /*@__PURE__*/proxyCustomElement(ConditionalRerender, [0,"conditional-rerender-root",{"showContent":[32],"showFooter":[32]}]);
          customElements.define(tagName, ConditionalRerender$1);
        }
        break;

    }
  });
};

export { ConditionalRerenderRoot, defineCustomElement };
