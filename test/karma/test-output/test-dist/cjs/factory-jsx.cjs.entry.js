'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const FactoryJSX = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  getJsxNode() {
    return index.h("div", null, "Factory JSX");
  }
  render() {
    return (index.h("div", null, this.getJsxNode(), this.getJsxNode()));
  }
};

exports.factory_jsx = FactoryJSX;
