import { r as registerInstance, h } from './index-a2c0d171.js';

const SvgAddClass = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", null, h("svg", { viewBox: "0 0 8 8", class: "existing-css-class" }, h("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
  }
};

export { SvgAddClass as es5_addclass_svg };
