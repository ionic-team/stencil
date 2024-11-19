'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const location$1 = 'module.js';

const location = 'module/index.js';

const NodeResolution = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("div", null, index.h("h1", null, "node-resolution"), index.h("p", { id: "module-index" }, location), index.h("p", { id: "module" }, location$1)));
  }
};

exports.node_resolution = NodeResolution;
