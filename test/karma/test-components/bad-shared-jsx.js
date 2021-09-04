import { h, proxyCustomElement } from '@stencil/core/internal/client';

const BadSharedJSX = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const sharedNode = h("div", null, "Do Not Share JSX Nodes!");
    return (h("div", null, sharedNode, sharedNode));
  }
};

const BadSharedJsx = /*@__PURE__*/proxyCustomElement(BadSharedJSX, [0,"bad-shared-jsx"]);
const components = ['bad-shared-jsx', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'bad-shared-jsx':
        tagName = 'bad-shared-jsx';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, BadSharedJsx);
        }
        break;

    }
  });
};

export { BadSharedJsx, defineCustomElement };
