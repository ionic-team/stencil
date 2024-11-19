'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ReflectToAttr = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.str = 'single';
    this.nu = 2;
    this.undef = undefined;
    this.null = null;
    this.bool = false;
    this.otherBool = true;
    this.disabled = false;
    this.dynamicStr = undefined;
    this.dynamicNu = undefined;
  }
  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }
  get el() { return index.getElement(this); }
};

exports.reflect_to_attr = ReflectToAttr;
