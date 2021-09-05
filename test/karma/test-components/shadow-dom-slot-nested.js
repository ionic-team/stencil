import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomSlotNested$1 } from './cmp8.js';

const ShadowDomSlotNested = /*@__PURE__*/ proxyCustomElement(ShadowDomSlotNested$1, [
  1,
  'shadow-dom-slot-nested',
  { i: [2] },
]);
const components = ['shadow-dom-slot-nested'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'shadow-dom-slot-nested':
        tagName = 'shadow-dom-slot-nested';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ShadowDomSlotNested);
        }
        break;
    }
  });
};

export { ShadowDomSlotNested, defineCustomElement };
