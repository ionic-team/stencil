import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotNestedOrderChild } from './cmp-child.js';

const SlotNestedOrderParent$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      Host,
      null,
      h('slot', null),
      h(
        'slot-nested-order-child',
        null,
        h('slot', { name: 'italic-slot-name' }),
        h('cmp-6', { slot: 'end-slot-name' }, '6')
      )
    );
  }
};

const SlotNestedOrderParent = /*@__PURE__*/ proxyCustomElement(SlotNestedOrderParent$1, [
  4,
  'slot-nested-order-parent',
]);
const components = ['slot-nested-order-parent', 'slot-nested-order-child'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-nested-order-parent':
        tagName = 'slot-nested-order-parent';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotNestedOrderParent);
        }
        break;

      case 'slot-nested-order-child':
        tagName = 'slot-nested-order-child';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotNestedOrderChild$1 = /*@__PURE__*/ proxyCustomElement(SlotNestedOrderChild, [
            4,
            'slot-nested-order-parent',
          ]);
          customElements.define(tagName, SlotNestedOrderChild$1);
        }
        break;
    }
  });
};

export { SlotNestedOrderParent, defineCustomElement };
