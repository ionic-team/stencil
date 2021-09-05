import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { d as data } from './external-data.js';

const ExternalImportB = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    this.first = data().first;
    this.last = data().last;
  }
  render() {
    return h('div', null, this.first, ' ', this.last);
  }
};

const ExternalImportC = /*@__PURE__*/ proxyCustomElement(ExternalImportB, [0, 'external-import-c']);
const components = ['external-import-c'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'external-import-c':
        tagName = 'external-import-c';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ExternalImportC);
        }
        break;
    }
  });
};

export { ExternalImportC, defineCustomElement };
