import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomBasic$1 } from './cmp6.js';

const ShadowDomBasic = /*@__PURE__*/proxyCustomElement(ShadowDomBasic$1, [1,"shadow-dom-basic"]);
const components = ['shadow-dom-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-basic':
        tagName = 'shadow-dom-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomBasic);
        }
        break;

    }
  });
};

export { ShadowDomBasic, defineCustomElement };
