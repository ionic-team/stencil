import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const cmpNoEncapsulationCss = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}";

const CssVariablesNoEncapsulation$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("div", { class: "black-local" }, "No encapsulation: Black background"), h("div", { class: "black-global" }, "No encapsulation: Black background (global style)"), h("div", { class: "yellow-global" }, "No encapsulation: Yellow background (global link)")));
  }
  static get style() { return cmpNoEncapsulationCss; }
};

const CssVariablesNoEncapsulation = /*@__PURE__*/proxyCustomElement(CssVariablesNoEncapsulation$1, [0,"css-variables-no-encapsulation"]);
const components = ['css-variables-no-encapsulation', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'css-variables-no-encapsulation':
        tagName = 'css-variables-no-encapsulation';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, CssVariablesNoEncapsulation);
        }
        break;

    }
  });
};

export { CssVariablesNoEncapsulation, defineCustomElement };
