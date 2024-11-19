'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const CustomElementRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("div", null, index.h("h2", null, "Root Element Loaded"), index.h("h3", null, "Child Component Loaded?"), index.h("custom-element-child", null)));
  }
};

exports.custom_element_root = CustomElementRoot;
