import { h, proxyCustomElement } from '@stencil/core/internal/client';

const ConditionalBasic$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showContent = false;
  }
  testClick() {
    this.showContent = !this.showContent;
  }
  render() {
    return h(
      'div',
      null,
      h('button', { onClick: this.testClick.bind(this), class: 'test' }, 'Test'),
      h('div', { class: 'results' }, this.showContent ? 'Content' : '')
    );
  }
};

const ConditionalBasic = /*@__PURE__*/ proxyCustomElement(ConditionalBasic$1, [
  0,
  'conditional-basic',
  { showContent: [32] },
]);
const components = ['conditional-basic'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'conditional-basic':
        tagName = 'conditional-basic';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ConditionalBasic);
        }
        break;
    }
  });
};

export { ConditionalBasic, defineCustomElement };
