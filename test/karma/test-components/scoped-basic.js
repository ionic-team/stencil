import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as ScopedBasic$1 } from './cmp4.js';

const ScopedBasic = /*@__PURE__*/ proxyCustomElement(ScopedBasic$1, [6, 'scoped-basic']);
const components = ['scoped-basic'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'scoped-basic':
        tagName = 'scoped-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ScopedBasic);
        }
        break;
    }
  });
};

export { ScopedBasic, defineCustomElement };
