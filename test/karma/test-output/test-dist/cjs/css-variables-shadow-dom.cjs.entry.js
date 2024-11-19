'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpShadowDomCss = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}";

const CssVariablesRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.isGreen = false;
  }
  render() {
    return (index.h(index.Host, { class: {
        'set-green': this.isGreen,
      } }, index.h("div", { class: "inner-div" }, "Shadow: ", this.isGreen ? 'Green' : 'Red', " background"), index.h("div", { class: "black-global-shadow" }, "Shadow: Black background (global)"), index.h("button", { onClick: () => {
        this.isGreen = !this.isGreen;
      } }, "Toggle color")));
  }
};
CssVariablesRoot.style = cmpShadowDomCss;

exports.css_variables_shadow_dom = CssVariablesRoot;
