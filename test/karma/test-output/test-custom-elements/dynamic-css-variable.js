import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const cmpCss = ":root{--font-color:blue}header{color:var(--font-color)}";

const DynamicCssVariables = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
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
    }
    else {
      this.bgColor = 'white';
    }
  }
  render() {
    return [
      h("header", { style: this.getBackgroundStyle() }, "Dynamic CSS Variables!!"),
      h("main", null, h("p", null, h("button", { onClick: this.changeColor.bind(this) }, "Change Color"))),
    ];
  }
  static get style() { return cmpCss; }
}, [0, "dynamic-css-variable", {
    "bgColor": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["dynamic-css-variable"];
  components.forEach(tagName => { switch (tagName) {
    case "dynamic-css-variable":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, DynamicCssVariables);
      }
      break;
  } });
}

const DynamicCssVariable = DynamicCssVariables;
const defineCustomElement = defineCustomElement$1;

export { DynamicCssVariable, defineCustomElement };
