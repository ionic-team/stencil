import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotBasic$1 } from './cmp10.js';

const SlotBasic = /*@__PURE__*/proxyCustomElement(SlotBasic$1, [4,"slot-basic"]);
const components = ['slot-basic', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-basic':
        tagName = 'slot-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotBasic);
        }
        break;

    }
  });
};

export { SlotBasic, defineCustomElement };
