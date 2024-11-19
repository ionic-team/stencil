import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const cmpShadowDomCss = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}";

const CssVariablesRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.isGreen = false;
  }
  render() {
    return (h(Host, { class: {
        'set-green': this.isGreen,
      } }, h("div", { class: "inner-div" }, "Shadow: ", this.isGreen ? 'Green' : 'Red', " background"), h("div", { class: "black-global-shadow" }, "Shadow: Black background (global)"), h("button", { onClick: () => {
        this.isGreen = !this.isGreen;
      } }, "Toggle color")));
  }
};
CssVariablesRoot.style = cmpShadowDomCss;

export { CssVariablesRoot as css_variables_shadow_dom };
