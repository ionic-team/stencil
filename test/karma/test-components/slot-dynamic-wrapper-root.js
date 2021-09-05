import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotDynamicWrapper } from './cmp12.js';

const SlotDynamicWrapperRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.tag = 'section';
  }
  changeWrapper() {
    if (this.tag === 'section') {
      this.tag = 'article';
    } else {
      this.tag = 'section';
    }
  }
  render() {
    return [
      h('button', { onClick: this.changeWrapper.bind(this) }, 'Change Wrapper'),
      h('slot-dynamic-wrapper', { tag: this.tag, class: 'results1' }, h('h1', null, 'parent text')),
    ];
  }
};

const SlotDynamicWrapperRoot = /*@__PURE__*/ proxyCustomElement(SlotDynamicWrapperRoot$1, [
  0,
  'slot-dynamic-wrapper-root',
  { tag: [32] },
]);
const components = ['slot-dynamic-wrapper-root', 'slot-dynamic-wrapper'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-dynamic-wrapper-root':
        tagName = 'slot-dynamic-wrapper-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotDynamicWrapperRoot);
        }
        break;

      case 'slot-dynamic-wrapper':
        tagName = 'slot-dynamic-wrapper';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotDynamicWrapper$1 = /*@__PURE__*/ proxyCustomElement(SlotDynamicWrapper, [
            0,
            'slot-dynamic-wrapper-root',
            { tag: [32] },
          ]);
          customElements.define(tagName, SlotDynamicWrapper$1);
        }
        break;
    }
  });
};

export { SlotDynamicWrapperRoot, defineCustomElement };
