import { h, proxyCustomElement } from '@stencil/core/internal/client';

const ListenWindow$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.clicked = 0;
    this.scrolled = 0;
  }
  winClick() {
    this.clicked++;
  }
  winScroll() {
    this.scrolled++;
  }
  render() {
    return h(
      'div',
      null,
      h('div', { id: 'clicked' }, 'Clicked: ', this.clicked),
      h('div', null, 'Scrolled: ', this.scrolled),
      h('button', null, 'Click!'),
      h('div', { style: { background: 'gray', paddingTop: '2000px' } })
    );
  }
};

const ListenWindow = /*@__PURE__*/ proxyCustomElement(ListenWindow$1, [
  0,
  'listen-window',
  { clicked: [32], scrolled: [32] },
  [
    [8, 'click', 'winClick'],
    [9, 'scroll', 'winScroll'],
  ],
]);
const components = ['listen-window'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'listen-window':
        tagName = 'listen-window';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ListenWindow);
        }
        break;
    }
  });
};

export { ListenWindow, defineCustomElement };
