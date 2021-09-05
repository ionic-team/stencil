import { h, proxyCustomElement } from '@stencil/core/internal/client';

const AttributeHtmlRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h('p', null, 'strAttr:', ' ', h('strong', { id: 'str-attr' }, this.strAttr, ' ', typeof this.strAttr)),
      h('p', null, 'anyAttr:', ' ', h('strong', { id: 'any-attr' }, this.anyAttr, ' ', typeof this.anyAttr)),
      h('p', null, 'nuAttr:', ' ', h('strong', { id: 'nu-attr' }, this.nuAttr, ' ', typeof this.nuAttr)),
    ];
  }
};

const AttributeHtmlRoot = /*@__PURE__*/ proxyCustomElement(AttributeHtmlRoot$1, [
  0,
  'attribute-html-root',
  { strAttr: [1, 'str-attr'], anyAttr: [8, 'any-attr'], nuAttr: [2, 'nu-attr'] },
]);
const components = ['attribute-html-root'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'attribute-html-root':
        tagName = 'attribute-html-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, AttributeHtmlRoot);
        }
        break;
    }
  });
};

export { AttributeHtmlRoot, defineCustomElement };
