import { h, proxyCustomElement } from '@stencil/core/internal/client';

const KeyReorderRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.isReversed = false;
  }
  testClick() {
    this.isReversed = !this.isReversed;
  }
  render() {
    let items = [0, 1, 2, 3, 4];
    if (this.isReversed) {
      items.reverse();
    }
    return [
      h("button", { onClick: this.testClick.bind(this) }, "Test"),
      h("div", null, items.map((item) => {
        return (h("div", { key: item, id: 'item-' + item }, item));
      })),
    ];
  }
};

const KeyReorderRoot = /*@__PURE__*/proxyCustomElement(KeyReorderRoot$1, [0,"key-reorder-root",{"isReversed":[32]}]);
const components = ['key-reorder-root', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'key-reorder-root':
        tagName = 'key-reorder-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, KeyReorderRoot);
        }
        break;

    }
  });
};

export { KeyReorderRoot, defineCustomElement };
