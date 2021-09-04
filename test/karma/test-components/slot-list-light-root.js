import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { D as DynamicListShadowComponent } from './dynamic-shadow-list-cmp.js';
import { S as SlotLightList } from './list-cmp2.js';

const SlotListLightRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.items = [];
  }
  needMore() {
    const newItems = [
      `Item ${this.items.length + 1}`,
      `Item ${this.items.length + 2}`,
      `Item ${this.items.length + 3}`,
      `Item ${this.items.length + 4}`,
    ];
    this.items = [...this.items, ...newItems];
  }
  render() {
    return (h("div", null, h("button", { onClick: () => this.needMore() }, "More"), h("slot-dynamic-shadow-list", { items: this.items })));
  }
};

const SlotListLightRoot = /*@__PURE__*/proxyCustomElement(SlotListLightRoot$1, [0,"slot-list-light-root",{"items":[1040]}]);
const components = ['slot-list-light-root', 'slot-dynamic-shadow-list', 'slot-light-list', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-list-light-root':
        tagName = 'slot-list-light-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotListLightRoot);
        }
        break;

      case 'slot-dynamic-shadow-list':
        tagName = 'slot-dynamic-shadow-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotDynamicShadowList = /*@__PURE__*/proxyCustomElement(DynamicListShadowComponent, [0,"slot-list-light-root",{"items":[1040]}]);
          customElements.define(tagName, SlotDynamicShadowList);
        }
        break;

      case 'slot-light-list':
        tagName = 'slot-light-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotLightList$1 = /*@__PURE__*/proxyCustomElement(SlotLightList, [0,"slot-list-light-root",{"items":[1040]}]);
          customElements.define(tagName, SlotLightList$1);
        }
        break;

    }
  });
};

export { SlotListLightRoot, defineCustomElement };
