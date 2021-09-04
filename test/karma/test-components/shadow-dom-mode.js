import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomMode$1 } from './cmp7.js';

const ShadowDomMode = /*@__PURE__*/proxyCustomElement(ShadowDomMode$1, [33,"shadow-dom-mode"]);
const components = ['shadow-dom-mode', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-mode':
        tagName = 'shadow-dom-mode';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomMode);
        }
        break;

    }
  });
};

export { ShadowDomMode, defineCustomElement };
