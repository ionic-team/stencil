import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotFallback$1 } from './cmp13.js';

const SlotFallback = /*@__PURE__*/proxyCustomElement(SlotFallback$1, [4,"slot-fallback",{"inc":[2]}]);
const components = ['slot-fallback', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-fallback':
        tagName = 'slot-fallback';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotFallback);
        }
        break;

    }
  });
};

export { SlotFallback, defineCustomElement };
