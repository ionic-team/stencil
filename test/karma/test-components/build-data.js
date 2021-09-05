import { h, Host, Build, proxyCustomElement } from '@stencil/core/internal/client';

const BuildData$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      Host,
      null,
      h('p', { class: 'is-dev' }, 'isDev: ', `${Build.isDev}`),
      h('p', { class: 'is-browser' }, 'isBrowser: ', `${Build.isBrowser}`),
      h('p', { class: 'is-testing' }, 'isTesting: ', `${Build.isTesting}`)
    );
  }
};

const BuildData = /*@__PURE__*/ proxyCustomElement(BuildData$1, [0, 'build-data']);
const components = ['build-data'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'build-data':
        tagName = 'build-data';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, BuildData);
        }
        break;
    }
  });
};

export { BuildData, defineCustomElement };
