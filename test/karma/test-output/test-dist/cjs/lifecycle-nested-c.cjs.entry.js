'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const output = require('./output-ea16c9f6.js');

const Cmpc = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output.output('componentWillLoad-c');
  }
  componentDidLoad() {
    output.output('componentDidLoad-c');
  }
  render() {
    return (index.h(index.Host, null, index.h("div", null, "hello")));
  }
};

exports.lifecycle_nested_c = Cmpc;
