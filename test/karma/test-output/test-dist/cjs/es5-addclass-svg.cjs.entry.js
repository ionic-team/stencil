'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SvgAddClass = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("div", null, index.h("svg", { viewBox: "0 0 8 8", class: "existing-css-class" }, index.h("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
  }
};

exports.es5_addclass_svg = SvgAddClass;
