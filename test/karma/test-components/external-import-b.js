import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { s as store } from './external-store.js';

const ExternalImportB$1 = class extends HTMLElement {
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
    return (h("div", null, this.first, " ", this.last));
  }
};

const ExternalImportB = /*@__PURE__*/proxyCustomElement(ExternalImportB$1, [0,"external-import-b"]);
const components = ['external-import-b', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'external-import-b':
        tagName = 'external-import-b';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ExternalImportB);
        }
        break;

    }
  });
};

export { ExternalImportB, defineCustomElement };
