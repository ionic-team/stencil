'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpNoEncapsulationCss = ":root{--font-weight:800}.black-local{--background:black;--color:white;background:var(--background);color:var(--color)}.black-global{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}.yellow-global{background:var(--link-background);color:black}";

const CssVariablesNoEncapsulation = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("div", { class: "black-local" }, "No encapsulation: Black background"), index.h("div", { class: "black-global" }, "No encapsulation: Black background (global style)"), index.h("div", { class: "yellow-global" }, "No encapsulation: Yellow background (global link)")));
  }
};
CssVariablesNoEncapsulation.style = cmpNoEncapsulationCss;

exports.css_variables_no_encapsulation = CssVariablesNoEncapsulation;
