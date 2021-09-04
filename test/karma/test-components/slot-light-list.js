import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotLightList$1 } from './list-cmp2.js';

const SlotLightList = /*@__PURE__*/proxyCustomElement(SlotLightList$1, [4,"slot-light-list"]);
const components = ['slot-light-list', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-light-list':
        tagName = 'slot-light-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotLightList);
        }
        break;

    }
  });
};

export { SlotLightList, defineCustomElement };
