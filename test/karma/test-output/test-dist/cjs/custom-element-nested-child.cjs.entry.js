'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const CustomElementNestedChild = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("div", null, index.h("strong", null, "Child Nested Component Loaded!")));
  }
};

exports.custom_element_nested_child = CustomElementNestedChild;
