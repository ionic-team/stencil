'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpCss = ":root{--font-color:blue}header{color:var(--font-color)}";

const DynamicCssVariables = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
      index.h("header", { style: this.getBackgroundStyle() }, "Dynamic CSS Variables!!"),
      index.h("main", null, index.h("p", null, index.h("button", { onClick: this.changeColor.bind(this) }, "Change Color"))),
    ];
  }
};
DynamicCssVariables.style = cmpCss;

exports.dynamic_css_variable = DynamicCssVariables;
