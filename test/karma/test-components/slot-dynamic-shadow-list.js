import { proxyCustomElement } from '@stencil/core/internal/client';
import { D as DynamicListShadowComponent } from './dynamic-shadow-list-cmp.js';
import { S as SlotLightList } from './list-cmp2.js';

const SlotDynamicShadowList = /*@__PURE__*/ proxyCustomElement(DynamicListShadowComponent, [
  1,
  'slot-dynamic-shadow-list',
  { items: [16] },
]);
const components = ['slot-dynamic-shadow-list', 'slot-light-list'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-dynamic-shadow-list':
        tagName = 'slot-dynamic-shadow-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotDynamicShadowList);
        }
        break;

      case 'slot-light-list':
        tagName = 'slot-light-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotLightList$1 = /*@__PURE__*/ proxyCustomElement(SlotLightList, [
            1,
            'slot-dynamic-shadow-list',
            { items: [16] },
          ]);
          customElements.define(tagName, SlotLightList$1);
        }
        break;
    }
  });
};

export { SlotDynamicShadowList, defineCustomElement };
