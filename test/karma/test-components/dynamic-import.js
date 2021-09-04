import { h, proxyCustomElement } from '@stencil/core/internal/client';

const DynamicImport$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await import('./module1.js')).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return h("div", null, this.value);
  }
};

const DynamicImport = /*@__PURE__*/proxyCustomElement(DynamicImport$1, [0,"dynamic-import",{"value":[32]}]);
const components = ['dynamic-import', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'dynamic-import':
        tagName = 'dynamic-import';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, DynamicImport);
        }
        break;

    }
  });
};

export { DynamicImport, defineCustomElement };
