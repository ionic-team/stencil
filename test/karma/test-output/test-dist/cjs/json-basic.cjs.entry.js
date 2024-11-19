'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const foo = "bar";

const JsonBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return index.h("div", { id: "json-foo" }, foo);
  }
};

exports.json_basic = JsonBasic;
