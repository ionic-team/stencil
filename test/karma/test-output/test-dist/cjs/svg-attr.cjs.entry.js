'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SvgAttr = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.isOpen = false;
  }
  testClick() {
    this.isOpen = !this.isOpen;
  }
  render() {
    return (index.h("div", null, index.h("div", null, index.h("button", { onClick: this.testClick.bind(this) }, "Test")), index.h("div", null, this.isOpen ? (index.h("svg", { viewBox: "0 0 54 54" }, index.h("rect", { transform: "rotate(45 27 27)", y: "22", width: "54", height: "10", rx: "2", stroke: "yellow", "stroke-width": "5px", "stroke-dasharray": "8 4" }))) : (index.h("svg", { viewBox: "0 0 54 54" }, index.h("rect", { y: "0", width: "54", height: "10", rx: "2", stroke: "blue", "stroke-width": "2px", "stroke-dasharray": "4 2" }))))));
  }
};

exports.svg_attr = SvgAttr;
