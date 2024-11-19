'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.wasClicked = '';
  }
  onClick() {
    this.wasClicked = 'Host event';
  }
  render() {
    return index.h("span", { id: "result" }, this.wasClicked);
  }
};
AttributeBasic.style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";

exports.listen_jsx = AttributeBasic;
