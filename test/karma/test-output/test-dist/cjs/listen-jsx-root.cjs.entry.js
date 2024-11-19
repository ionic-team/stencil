'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.onClick = () => {
      this.wasClicked = 'Parent event';
    };
    this.wasClicked = '';
  }
  render() {
    return [index.h("span", { id: "result-root" }, this.wasClicked), index.h("listen-jsx", { onClick: this.onClick })];
  }
};

exports.listen_jsx_root = AttributeBasicRoot;
