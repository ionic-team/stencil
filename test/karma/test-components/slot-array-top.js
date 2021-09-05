import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const SlotArrayTop$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return [h('span', null, 'Content should be on top'), h('slot', null)];
  }
};

const SlotArrayTop = /*@__PURE__*/ proxyCustomElement(SlotArrayTop$1, [1, 'slot-array-top']);
const components = ['slot-array-top'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-array-top':
        tagName = 'slot-array-top';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotArrayTop);
        }
        break;
    }
  });
};

export { SlotArrayTop, defineCustomElement };
