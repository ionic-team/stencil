import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotBasicOrder$1 } from './cmp11.js';

const SlotBasicOrder = /*@__PURE__*/ proxyCustomElement(SlotBasicOrder$1, [4, 'slot-basic-order']);
const components = ['slot-basic-order'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-basic-order':
        tagName = 'slot-basic-order';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotBasicOrder);
        }
        break;
    }
  });
};

export { SlotBasicOrder, defineCustomElement };
