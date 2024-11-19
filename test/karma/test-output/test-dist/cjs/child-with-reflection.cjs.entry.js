'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ChildWithReflection = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
    this.val = undefined;
  }
  render() {
    this.renderCount += 1;
    return (index.h("div", null, index.h("div", null, "Child Render Count: ", this.renderCount), index.h("input", { step: this.val })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

exports.child_with_reflection = ChildWithReflection;
