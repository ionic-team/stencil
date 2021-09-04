import { h, proxyCustomElement } from '@stencil/core/internal/client';

const KeyReorder$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("div", null, this.num);
  }
};

const KeyReorder = /*@__PURE__*/proxyCustomElement(KeyReorder$1, [0,"key-reorder",{"num":[2]}]);
const components = ['key-reorder', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'key-reorder':
        tagName = 'key-reorder';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, KeyReorder);
        }
        break;

    }
  });
};

export { KeyReorder, defineCustomElement };
