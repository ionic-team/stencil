'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ConditionalRerenderRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.showContent = false;
    this.showFooter = false;
  }
  componentDidLoad() {
    this.showFooter = true;
    setTimeout(() => (this.showContent = true), 20);
  }
  render() {
    return (index.h("conditional-rerender", null, index.h("header", null, "Header"), this.showContent ? index.h("section", null, "Content") : null, this.showFooter ? index.h("footer", null, "Footer") : null));
  }
};

exports.conditional_rerender_root = ConditionalRerenderRoot;
