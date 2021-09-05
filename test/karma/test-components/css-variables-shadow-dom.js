import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const cmpShadowDomCss =
  ':host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}';

const CssVariablesRoot = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.isGreen = false;
  }
  render() {
    return h(
      Host,
      {
        class: {
          'set-green': this.isGreen,
        },
      },
      h('div', { class: 'inner-div' }, 'Shadow: ', this.isGreen ? 'Green' : 'Red', ' background'),
      h('div', { class: 'black-global-shadow' }, 'Shadow: Black background (global)'),
      h(
        'button',
        {
          onClick: () => {
            this.isGreen = !this.isGreen;
          },
        },
        'Toggle color'
      )
    );
  }
  static get style() {
    return cmpShadowDomCss;
  }
};

const CssVariablesShadowDom = /*@__PURE__*/ proxyCustomElement(CssVariablesRoot, [
  1,
  'css-variables-shadow-dom',
  { isGreen: [32] },
]);
const components = ['css-variables-shadow-dom'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'css-variables-shadow-dom':
        tagName = 'css-variables-shadow-dom';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, CssVariablesShadowDom);
        }
        break;
    }
  });
};

export { CssVariablesShadowDom, defineCustomElement };
