import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotMapOrder$1 } from './cmp15.js';

const SlotMapOrder = /*@__PURE__*/ proxyCustomElement(SlotMapOrder$1, [4, 'slot-map-order']);
const components = ['slot-map-order'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-map-order':
        tagName = 'slot-map-order';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotMapOrder);
        }
        break;
    }
  });
};

export { SlotMapOrder, defineCustomElement };
