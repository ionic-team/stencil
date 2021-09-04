import { proxyCustomElement } from '@stencil/core/internal/client';
import { D as DynamicListScopedComponent } from './dynamic-scoped-list-cmp.js';
import { S as SlotLightScopedList } from './list-cmp.js';

const SlotDynamicScopedList = /*@__PURE__*/proxyCustomElement(DynamicListScopedComponent, [2,"slot-dynamic-scoped-list",{"items":[16]}]);
const components = ['slot-dynamic-scoped-list', 'slot-light-scoped-list', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-dynamic-scoped-list':
        tagName = 'slot-dynamic-scoped-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotDynamicScopedList);
        }
        break;

      case 'slot-light-scoped-list':
        tagName = 'slot-light-scoped-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotLightScopedList$1 = /*@__PURE__*/proxyCustomElement(SlotLightScopedList, [2,"slot-dynamic-scoped-list",{"items":[16]}]);
          customElements.define(tagName, SlotLightScopedList$1);
        }
        break;

    }
  });
};

export { SlotDynamicScopedList, defineCustomElement };
