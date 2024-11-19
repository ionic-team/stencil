'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ConditionalBasic = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.showContent = false;
  }
  testClick() {
    this.showContent = !this.showContent;
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), index.h("div", { class: "results" }, this.showContent ? 'Content' : '')));
  }
};

exports.conditional_basic = ConditionalBasic;
