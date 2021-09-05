import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotReorder$1 } from './cmp16.js';

const SlotReorder = /*@__PURE__*/ proxyCustomElement(SlotReorder$1, [4, 'slot-reorder', { reordered: [4] }]);
const components = ['slot-reorder'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-reorder':
        tagName = 'slot-reorder';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotReorder);
        }
        break;
    }
  });
};

export { SlotReorder, defineCustomElement };
