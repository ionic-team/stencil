import { h, proxyCustomElement } from '@stencil/core/internal/client';

const CmpTag88 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h('div', null, 'tag-88');
  }
};

const Tag88 = /*@__PURE__*/ proxyCustomElement(CmpTag88, [0, 'tag-88']);
const components = ['tag-88'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'tag-88':
        tagName = 'tag-88';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, Tag88);
        }
        break;
    }
  });
};

export { Tag88, defineCustomElement };
