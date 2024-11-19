import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const cmpShadowDomCss = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}";

const CssVariablesRoot = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.isGreen = false;
  }
  render() {
    return (h(Host, { class: {
        'set-green': this.isGreen,
      } }, h("div", { class: "inner-div" }, "Shadow: ", this.isGreen ? 'Green' : 'Red', " background"), h("div", { class: "black-global-shadow" }, "Shadow: Black background (global)"), h("button", { onClick: () => {
        this.isGreen = !this.isGreen;
      } }, "Toggle color")));
  }
  static get style() { return cmpShadowDomCss; }
}, [1, "css-variables-shadow-dom", {
    "isGreen": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["css-variables-shadow-dom"];
  components.forEach(tagName => { switch (tagName) {
    case "css-variables-shadow-dom":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CssVariablesRoot);
      }
      break;
  } });
}

const CssVariablesShadowDom = CssVariablesRoot;
const defineCustomElement = defineCustomElement$1;

export { CssVariablesShadowDom, defineCustomElement };
