import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { s as store } from './external-store.js';

const ExternalImportA$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    const data = store().data;
    this.first = data.first;
    this.last = data.last;
  }
  render() {
    return h('div', null, this.first, ' ', this.last);
  }
};

const ExternalImportA = /*@__PURE__*/ proxyCustomElement(ExternalImportA$1, [0, 'external-import-a']);
const components = ['external-import-a'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'external-import-a':
        tagName = 'external-import-a';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ExternalImportA);
        }
        break;
    }
  });
};

export { ExternalImportA, defineCustomElement };
