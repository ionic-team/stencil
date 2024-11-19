'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomArrayRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.values = [0];
  }
  addValue() {
    this.values = [...this.values, this.values.length];
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.addValue.bind(this) }, "Add Value"), index.h("shadow-dom-array", { values: this.values, class: "results1" })));
  }
};

exports.shadow_dom_array_root = ShadowDomArrayRoot;
