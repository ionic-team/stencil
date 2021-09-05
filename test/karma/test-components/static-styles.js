import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const StaticStyles$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, null, h('h1', null, 'static get styles()'));
  }
  static get style() {
    return 'h1 {\n        color: red;\n      }';
  }
};

const StaticStyles = /*@__PURE__*/ proxyCustomElement(StaticStyles$1, [0, 'static-styles']);
const components = ['static-styles'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'static-styles':
        tagName = 'static-styles';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, StaticStyles);
        }
        break;
    }
  });
};

export { StaticStyles, defineCustomElement };
