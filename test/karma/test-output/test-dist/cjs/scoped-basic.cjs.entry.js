'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ScopedBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [
      index.h("div", null, "scoped"),
      index.h("p", null, index.h("slot", null)),
    ];
  }
};
ScopedBasic.style = ".sc-scoped-basic-h {\n      display: block;\n      background: black;\n      color: grey;\n    }\n\n    div.sc-scoped-basic {\n      color: red;\n    }\n\n    .sc-scoped-basic-s > span {\n      color: yellow;\n    }";

exports.scoped_basic = ScopedBasic;
