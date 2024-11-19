'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const MyComponent = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
    // karma tests
    this.renderCount = 0;
  }
  render() {
    this.renderCount += 1;
    return (index.h("div", null, index.h("div", null, "Parent Render Count: ", this.renderCount), index.h("child-with-reflection", { val: 1 })));
  }
  componentDidUpdate() {
    this.renderCount += 1;
  }
};

exports.parent_with_reflect_child = MyComponent;
