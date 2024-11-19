'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this._getter = 'getter';
    this.single = 'single';
    this.multiWord = 'multiWord';
    this.customAttr = 'my-custom-attr';
  }
  get getter() {
    return this._getter;
  }
  set getter(newVal) {
    this._getter = newVal;
  }
  render() {
    return (index.h("div", null, index.h("div", { class: "single" }, this.single), index.h("div", { class: "multiWord" }, this.multiWord), index.h("div", { class: "customAttr" }, this.customAttr), index.h("div", { class: "getter" }, this.getter), index.h("div", null, index.h("label", { class: "htmlForLabel", htmlFor: 'a' }, "htmlFor"), index.h("input", { type: "checkbox", id: 'a' }))));
  }
};

exports.attribute_basic = AttributeBasic;
