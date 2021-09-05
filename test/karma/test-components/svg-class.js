import { h, proxyCustomElement } from '@stencil/core/internal/client';

const SvgClass$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.hasColor = false;
  }
  testClick() {
    this.hasColor = !this.hasColor;
  }
  render() {
    return h(
      'div',
      null,
      h('div', null, h('button', { onClick: this.testClick.bind(this) }, 'Test')),
      h(
        'div',
        null,
        h(
          'svg',
          { viewBox: '0 0 54 54', class: this.hasColor ? 'primary' : undefined },
          h('circle', {
            cx: '8',
            cy: '18',
            width: '54',
            height: '8',
            r: '2',
            class: this.hasColor ? 'red' : undefined,
          }),
          h('rect', { y: '2', width: '54', height: '8', rx: '2', class: this.hasColor ? 'blue' : undefined })
        )
      )
    );
  }
};

const SvgClass = /*@__PURE__*/ proxyCustomElement(SvgClass$1, [0, 'svg-class', { hasColor: [32] }]);
const components = ['svg-class'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'svg-class':
        tagName = 'svg-class';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SvgClass);
        }
        break;
    }
  });
};

export { SvgClass, defineCustomElement };
