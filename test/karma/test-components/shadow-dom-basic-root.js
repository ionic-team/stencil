import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomBasic } from './cmp6.js';

const ShadowDomBasicRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h('shadow-dom-basic', null, h('div', null, 'light'));
  }
  static get style() {
    return 'div {\n      background: rgb(255, 255, 0);\n    }';
  }
};

const ShadowDomBasicRoot = /*@__PURE__*/ proxyCustomElement(ShadowDomBasicRoot$1, [1, 'shadow-dom-basic-root']);
const components = ['shadow-dom-basic-root', 'shadow-dom-basic'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'shadow-dom-basic-root':
        tagName = 'shadow-dom-basic-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ShadowDomBasicRoot);
        }
        break;

      case 'shadow-dom-basic':
        tagName = 'shadow-dom-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ShadowDomBasic$1 = /*@__PURE__*/ proxyCustomElement(ShadowDomBasic, [1, 'shadow-dom-basic-root']);
          customElements.define(tagName, ShadowDomBasic$1);
        }
        break;
    }
  });
};

export { ShadowDomBasicRoot, defineCustomElement };
