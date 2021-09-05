import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotLightScopedList$1 } from './list-cmp.js';

const SlotLightScopedList = /*@__PURE__*/ proxyCustomElement(SlotLightScopedList$1, [4, 'slot-light-scoped-list']);
const components = ['slot-light-scoped-list'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-light-scoped-list':
        tagName = 'slot-light-scoped-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotLightScopedList);
        }
        break;
    }
  });
};

export { SlotLightScopedList, defineCustomElement };
