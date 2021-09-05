import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotArrayComplex$1 } from './cmp9.js';

const SlotArrayComplex = /*@__PURE__*/ proxyCustomElement(SlotArrayComplex$1, [4, 'slot-array-complex']);
const components = ['slot-array-complex'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-array-complex':
        tagName = 'slot-array-complex';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotArrayComplex);
        }
        break;
    }
  });
};

export { SlotArrayComplex, defineCustomElement };
