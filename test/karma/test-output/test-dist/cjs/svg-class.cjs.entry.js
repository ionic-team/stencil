'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SvgClass = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.hasColor = false;
  }
  testClick() {
    this.hasColor = !this.hasColor;
  }
  render() {
    return (index.h("div", null, index.h("div", null, index.h("button", { onClick: this.testClick.bind(this) }, "Test")), index.h("div", null, index.h("svg", { viewBox: "0 0 54 54", class: this.hasColor ? 'primary' : undefined }, index.h("circle", { cx: "8", cy: "18", width: "54", height: "8", r: "2", class: this.hasColor ? 'red' : undefined }), index.h("rect", { y: "2", width: "54", height: "8", rx: "2", class: this.hasColor ? 'blue' : undefined })))));
  }
};

exports.svg_class = SvgClass;
