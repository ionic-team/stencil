import { h, proxyCustomElement } from '@stencil/core/internal/client';

const cmpCss = ':root{--font-color:blue}header{color:var(--font-color)}';

const DynamicCssVariables = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.bgColor = 'white';
  }
  getBackgroundStyle() {
    return this.bgColor && this.bgColor !== 'white' ? { background: this.bgColor, '--font-color': 'white' } : {};
  }
  changeColor() {
    if (this.bgColor === 'white') {
      this.bgColor = 'red';
    } else {
      this.bgColor = 'white';
    }
  }
  render() {
    return [
      h('header', { style: this.getBackgroundStyle() }, 'Dynamic CSS Variables!!'),
      h('main', null, h('p', null, h('button', { onClick: this.changeColor.bind(this) }, 'Change Color'))),
    ];
  }
  static get style() {
    return cmpCss;
  }
};

const DynamicCssVariable = /*@__PURE__*/ proxyCustomElement(DynamicCssVariables, [
  0,
  'dynamic-css-variable',
  { bgColor: [32] },
]);
const components = ['dynamic-css-variable'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'dynamic-css-variable':
        tagName = 'dynamic-css-variable';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, DynamicCssVariable);
        }
        break;
    }
  });
};

export { DynamicCssVariable, defineCustomElement };
