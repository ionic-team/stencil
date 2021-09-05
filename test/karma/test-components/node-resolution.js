import { h, proxyCustomElement } from '@stencil/core/internal/client';

const location$1 = 'module.js';

const location = 'module/index.js';

const NodeResolution$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      'div',
      null,
      h('h1', null, 'node-resolution'),
      h('p', { id: 'module-index' }, location),
      h('p', { id: 'module' }, location$1)
    );
  }
};

const NodeResolution = /*@__PURE__*/ proxyCustomElement(NodeResolution$1, [0, 'node-resolution']);
const components = ['node-resolution'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'node-resolution':
        tagName = 'node-resolution';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, NodeResolution);
        }
        break;
    }
  });
};

export { NodeResolution, defineCustomElement };
