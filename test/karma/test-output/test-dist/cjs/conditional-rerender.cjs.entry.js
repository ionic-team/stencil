'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ConditionalRerender = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("main", null, index.h("slot", null), index.h("nav", null, "Nav")));
  }
};

exports.conditional_rerender = ConditionalRerender;
