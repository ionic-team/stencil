import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotReplaceWrapper$1 } from './cmp17.js';

const SlotReplaceWrapper = /*@__PURE__*/ proxyCustomElement(SlotReplaceWrapper$1, [
  4,
  'slot-replace-wrapper',
  { href: [1] },
]);
const components = ['slot-replace-wrapper'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-replace-wrapper':
        tagName = 'slot-replace-wrapper';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotReplaceWrapper);
        }
        break;
    }
  });
};

export { SlotReplaceWrapper, defineCustomElement };
