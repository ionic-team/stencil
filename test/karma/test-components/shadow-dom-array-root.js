import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomArray } from './cmp5.js';

const ShadowDomArrayRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.values = [0];
  }
  addValue() {
    this.values = [...this.values, this.values.length];
  }
  render() {
    return (h("div", null, h("button", { onClick: this.addValue.bind(this) }, "Add Value"), h("shadow-dom-array", { values: this.values, class: "results1" })));
  }
};

const ShadowDomArrayRoot = /*@__PURE__*/proxyCustomElement(ShadowDomArrayRoot$1, [0,"shadow-dom-array-root",{"values":[32]}]);
const components = ['shadow-dom-array-root', 'shadow-dom-array', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-array-root':
        tagName = 'shadow-dom-array-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomArrayRoot);
        }
        break;

      case 'shadow-dom-array':
        tagName = 'shadow-dom-array';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ShadowDomArray$1 = /*@__PURE__*/proxyCustomElement(ShadowDomArray, [0,"shadow-dom-array-root",{"values":[32]}]);
          customElements.define(tagName, ShadowDomArray$1);
        }
        break;

    }
  });
};

export { ShadowDomArrayRoot, defineCustomElement };
