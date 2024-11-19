'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpRootMdCss = ".sc-scoped-basic-root-md-h{color:white}";

const ScopedBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("scoped-basic", null, index.h("span", null, "light")));
  }
};
ScopedBasicRoot.style = {
  md: cmpRootMdCss
};

exports.scoped_basic_root = ScopedBasicRoot;
