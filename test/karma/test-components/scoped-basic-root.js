import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as ScopedBasic } from './cmp4.js';

const cmpRootMdCss = '.sc-scoped-basic-root-md-h{color:white}';

const ScopedBasicRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h('scoped-basic', null, h('span', null, 'light'));
  }
  static get style() {
    return {
      md: cmpRootMdCss,
    };
  }
};

const ScopedBasicRoot = /*@__PURE__*/ proxyCustomElement(ScopedBasicRoot$1, [34, 'scoped-basic-root']);
const components = ['scoped-basic-root', 'scoped-basic'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'scoped-basic-root':
        tagName = 'scoped-basic-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ScopedBasicRoot);
        }
        break;

      case 'scoped-basic':
        tagName = 'scoped-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ScopedBasic$1 = /*@__PURE__*/ proxyCustomElement(ScopedBasic, [34, 'scoped-basic-root']);
          customElements.define(tagName, ScopedBasic$1);
        }
        break;
    }
  });
};

export { ScopedBasicRoot, defineCustomElement };
