'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomArray = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.values = [];
  }
  render() {
    return this.values.map((v) => index.h("div", null, v));
  }
};

exports.shadow_dom_array = ShadowDomArray;
