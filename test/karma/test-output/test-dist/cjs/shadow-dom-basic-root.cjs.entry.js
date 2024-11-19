'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h("shadow-dom-basic", null, index.h("div", null, "light")));
  }
};
ShadowDomBasicRoot.style = "div {\n      background: rgb(255, 255, 0);\n    }";

exports.shadow_dom_basic_root = ShadowDomBasicRoot;
