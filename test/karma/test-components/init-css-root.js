import { h, proxyCustomElement } from '@stencil/core/internal/client';

const cmpRootCss =
  'div#relativeToRoot{background-image:url("/assets/favicon.ico?relativeToRoot")}div#relative{background-image:url("../assets/favicon.ico?relative")}div#absolute{background-image:url("https://www.google.com/favicon.ico")}';

const InitCssRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [h('div', { id: 'relative' }), h('div', { id: 'relativeToRoot' }), h('div', { id: 'absolute' })];
  }
  static get style() {
    return cmpRootCss;
  }
};

const InitCssRoot = /*@__PURE__*/ proxyCustomElement(InitCssRoot$1, [0, 'init-css-root']);
const components = ['init-css-root'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'init-css-root':
        tagName = 'init-css-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, InitCssRoot);
        }
        break;
    }
  });
};

export { InitCssRoot, defineCustomElement };
