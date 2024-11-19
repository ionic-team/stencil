'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeComplex = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this._obj = { name: 'James bond' };
    this.nu0 = 1;
    this.nu1 = undefined;
    this.nu2 = undefined;
    this.bool0 = true;
    this.bool1 = undefined;
    this.bool2 = undefined;
    this.str0 = 'hello';
    this.str1 = undefined;
    this.str2 = undefined;
  }
  get obj() {
    return JSON.stringify(this._obj);
  }
  set obj(newVal) {
    if (typeof newVal === 'string') {
      this._obj = { name: newVal };
    }
  }
  async getInstance() {
    return this;
  }
};

exports.attribute_complex = AttributeComplex;
