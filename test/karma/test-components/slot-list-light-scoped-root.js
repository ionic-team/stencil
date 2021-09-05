import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { D as DynamicListScopedComponent } from './dynamic-scoped-list-cmp.js';
import { S as SlotLightScopedList } from './list-cmp.js';

const SlotListLightScopedRoot$1 = class extends HTMLElement {
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
    return h(
      'div',
      null,
      h('button', { onClick: () => this.needMore() }, 'More'),
      h('slot-dynamic-scoped-list', { items: this.items })
    );
  }
};

const SlotListLightScopedRoot = /*@__PURE__*/ proxyCustomElement(SlotListLightScopedRoot$1, [
  0,
  'slot-list-light-scoped-root',
  { items: [1040] },
]);
const components = ['slot-list-light-scoped-root', 'slot-dynamic-scoped-list', 'slot-light-scoped-list'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-list-light-scoped-root':
        tagName = 'slot-list-light-scoped-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotListLightScopedRoot);
        }
        break;

      case 'slot-dynamic-scoped-list':
        tagName = 'slot-dynamic-scoped-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotDynamicScopedList = /*@__PURE__*/ proxyCustomElement(DynamicListScopedComponent, [
            0,
            'slot-list-light-scoped-root',
            { items: [1040] },
          ]);
          customElements.define(tagName, SlotDynamicScopedList);
        }
        break;

      case 'slot-light-scoped-list':
        tagName = 'slot-light-scoped-list';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotLightScopedList$1 = /*@__PURE__*/ proxyCustomElement(SlotLightScopedList, [
            0,
            'slot-list-light-scoped-root',
            { items: [1040] },
          ]);
          customElements.define(tagName, SlotLightScopedList$1);
        }
        break;
    }
  });
};

export { SlotListLightScopedRoot, defineCustomElement };
