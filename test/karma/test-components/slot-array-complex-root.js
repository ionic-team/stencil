import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotArrayComplex } from './cmp9.js';

const SlotArrayComplexRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.endSlot = false;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return h(
      'main',
      null,
      h(
        'slot-array-complex',
        null,
        h('header', { slot: 'start' }, 'slot - start'),
        'slot - default',
        this.endSlot ? h('footer', { slot: 'end' }, 'slot - end') : null
      )
    );
  }
};

const SlotArrayComplexRoot = /*@__PURE__*/ proxyCustomElement(SlotArrayComplexRoot$1, [
  0,
  'slot-array-complex-root',
  { endSlot: [32] },
]);
const components = ['slot-array-complex-root', 'slot-array-complex'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-array-complex-root':
        tagName = 'slot-array-complex-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotArrayComplexRoot);
        }
        break;

      case 'slot-array-complex':
        tagName = 'slot-array-complex';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotArrayComplex$1 = /*@__PURE__*/ proxyCustomElement(SlotArrayComplex, [
            0,
            'slot-array-complex-root',
            { endSlot: [32] },
          ]);
          customElements.define(tagName, SlotArrayComplex$1);
        }
        break;
    }
  });
};

export { SlotArrayComplexRoot, defineCustomElement };
