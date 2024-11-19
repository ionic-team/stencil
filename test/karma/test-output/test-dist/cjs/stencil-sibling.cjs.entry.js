'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const StencilSibling = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("sibling-root", null, "sibling-light-dom")));
  }
};

exports.stencil_sibling = StencilSibling;
