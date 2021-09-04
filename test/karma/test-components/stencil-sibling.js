import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SiblingRoot } from './sibling-root2.js';

const StencilSibling$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("sibling-root", null, "sibling-light-dom")));
  }
};

const StencilSibling = /*@__PURE__*/proxyCustomElement(StencilSibling$1, [0,"stencil-sibling"]);
const components = ['stencil-sibling', 'sibling-root', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'stencil-sibling':
        tagName = 'stencil-sibling';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, StencilSibling);
        }
        break;

      case 'sibling-root':
        tagName = 'sibling-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SiblingRoot$1 = /*@__PURE__*/proxyCustomElement(SiblingRoot, [0,"stencil-sibling"]);
          customElements.define(tagName, SiblingRoot$1);
        }
        break;

    }
  });
};

export { StencilSibling, defineCustomElement };
