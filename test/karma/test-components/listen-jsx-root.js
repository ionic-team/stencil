import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { A as AttributeBasic } from './cmp3.js';

const AttributeBasicRoot = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.wasClicked = '';
    this.onClick = () => {
      this.wasClicked = 'Parent event';
    };
  }
  render() {
    return [h("span", { id: "result-root" }, this.wasClicked), h("listen-jsx", { onClick: this.onClick })];
  }
};

const ListenJsxRoot = /*@__PURE__*/proxyCustomElement(AttributeBasicRoot, [0,"listen-jsx-root",{"wasClicked":[32]}]);
const components = ['listen-jsx-root', 'listen-jsx', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'listen-jsx-root':
        tagName = 'listen-jsx-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ListenJsxRoot);
        }
        break;

      case 'listen-jsx':
        tagName = 'listen-jsx';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ListenJsx = /*@__PURE__*/proxyCustomElement(AttributeBasic, [0,"listen-jsx-root",{"wasClicked":[32]}]);
          customElements.define(tagName, ListenJsx);
        }
        break;

    }
  });
};

export { ListenJsxRoot, defineCustomElement };
