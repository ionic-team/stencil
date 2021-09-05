import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotDynamicWrapper$1 } from './cmp12.js';

const SlotDynamicWrapper = /*@__PURE__*/ proxyCustomElement(SlotDynamicWrapper$1, [
  4,
  'slot-dynamic-wrapper',
  { tag: [1] },
]);
const components = ['slot-dynamic-wrapper'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-dynamic-wrapper':
        tagName = 'slot-dynamic-wrapper';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotDynamicWrapper);
        }
        break;
    }
  });
};

export { SlotDynamicWrapper, defineCustomElement };
