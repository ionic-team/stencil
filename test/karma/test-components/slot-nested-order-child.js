import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotNestedOrderChild$1 } from './cmp-child.js';

const SlotNestedOrderChild = /*@__PURE__*/proxyCustomElement(SlotNestedOrderChild$1, [4,"slot-nested-order-child"]);
const components = ['slot-nested-order-child', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-nested-order-child':
        tagName = 'slot-nested-order-child';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotNestedOrderChild);
        }
        break;

    }
  });
};

export { SlotNestedOrderChild, defineCustomElement };
