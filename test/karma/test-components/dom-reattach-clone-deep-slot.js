import { h, proxyCustomElement } from '@stencil/core/internal/client';

const DomReattachCloneDeep = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      'div',
      { class: 'wrapper' },
      h('span', { class: 'component-mark-up' }, 'Component mark-up'),
      h('div', null, h('section', null, h('slot', null)))
    );
  }
};

const DomReattachCloneDeepSlot = /*@__PURE__*/ proxyCustomElement(DomReattachCloneDeep, [
  4,
  'dom-reattach-clone-deep-slot',
]);
const components = ['dom-reattach-clone-deep-slot'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'dom-reattach-clone-deep-slot':
        tagName = 'dom-reattach-clone-deep-slot';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, DomReattachCloneDeepSlot);
        }
        break;
    }
  });
};

export { DomReattachCloneDeepSlot, defineCustomElement };
