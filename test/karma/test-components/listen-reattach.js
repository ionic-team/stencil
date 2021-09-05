import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const ListenReattach$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.clicked = 0;
  }
  click() {
    this.clicked++;
  }
  render() {
    return h(Host, null, h('div', { id: 'clicked' }, 'Clicked: ', this.clicked));
  }
  static get style() {
    return '.sc-listen-reattach-h { display: block; background: gray;}';
  }
};

const ListenReattach = /*@__PURE__*/ proxyCustomElement(ListenReattach$1, [
  2,
  'listen-reattach',
  { clicked: [32] },
  [[0, 'click', 'click']],
]);
const components = ['listen-reattach'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'listen-reattach':
        tagName = 'listen-reattach';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ListenReattach);
        }
        break;
    }
  });
};

export { ListenReattach, defineCustomElement };
