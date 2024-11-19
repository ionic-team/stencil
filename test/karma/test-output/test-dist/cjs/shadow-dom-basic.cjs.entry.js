'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [index.h("div", null, "shadow"), index.h("slot", null)];
  }
};
ShadowDomBasic.style = "div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }";

exports.shadow_dom_basic = ShadowDomBasic;
