import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';

const cmpNoEncapsulationCss = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}";

const CssVariablesNoEncapsulation$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("div", { class: "black-local" }, "No encapsulation: Black background"), h("div", { class: "black-global" }, "No encapsulation: Black background (global style)"), h("div", { class: "yellow-global" }, "No encapsulation: Yellow background (global link)")));
  }
  static get style() { return cmpNoEncapsulationCss; }
}, [0, "css-variables-no-encapsulation"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["css-variables-no-encapsulation"];
  components.forEach(tagName => { switch (tagName) {
    case "css-variables-no-encapsulation":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CssVariablesNoEncapsulation$1);
      }
      break;
  } });
}

const CssVariablesNoEncapsulation = CssVariablesNoEncapsulation$1;
const defineCustomElement = defineCustomElement$1;

export { CssVariablesNoEncapsulation, defineCustomElement };
