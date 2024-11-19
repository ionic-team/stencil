'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const BadSharedJSX = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    const sharedNode = index.h("div", null, "Do Not Share JSX Nodes!");
    return (index.h("div", null, sharedNode, sharedNode));
  }
};

exports.bad_shared_jsx = BadSharedJSX;
