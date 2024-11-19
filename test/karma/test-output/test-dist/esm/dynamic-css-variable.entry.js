import { r as registerInstance, h } from './index-a2c0d171.js';

const cmpCss = ":root{--font-color:blue}header{color:var(--font-color)}";

const DynamicCssVariables = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
};
DynamicCssVariables.style = cmpCss;

export { DynamicCssVariables as dynamic_css_variable };
