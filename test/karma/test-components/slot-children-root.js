import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const SlotChildrenRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h('section', null, 'ShadowRoot1', h('article', null, h('slot', null)), 'ShadowRoot2');
  }
};

const SlotChildrenRoot = /*@__PURE__*/ proxyCustomElement(SlotChildrenRoot$1, [1, 'slot-children-root']);
const components = ['slot-children-root'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-children-root':
        tagName = 'slot-children-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotChildrenRoot);
        }
        break;
    }
  });
};

export { SlotChildrenRoot, defineCustomElement };
