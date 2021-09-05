import { h, proxyCustomElement } from '@stencil/core/internal/client';

const FactoryJSX = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  getJsxNode() {
    return h('div', null, 'Factory JSX');
  }
  render() {
    return h('div', null, this.getJsxNode(), this.getJsxNode());
  }
};

const FactoryJsx = /*@__PURE__*/ proxyCustomElement(FactoryJSX, [0, 'factory-jsx']);
const components = ['factory-jsx'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'factory-jsx':
        tagName = 'factory-jsx';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, FactoryJsx);
        }
        break;
    }
  });
};

export { FactoryJsx, defineCustomElement };
