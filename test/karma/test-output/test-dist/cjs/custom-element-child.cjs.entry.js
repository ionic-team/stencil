'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const CustomElementChild = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("div", null, index.h("strong", null, "Child Component Loaded!"), index.h("h3", null, "Child Nested Component?"), index.h("custom-element-nested-child", null)));
  }
};

exports.custom_element_child = CustomElementChild;
