import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomArray$1 } from './cmp5.js';

const ShadowDomArray = /*@__PURE__*/proxyCustomElement(ShadowDomArray$1, [1,"shadow-dom-array",{"values":[16]}]);
const components = ['shadow-dom-array', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-array':
        tagName = 'shadow-dom-array';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomArray);
        }
        break;

    }
  });
};

export { ShadowDomArray, defineCustomElement };
