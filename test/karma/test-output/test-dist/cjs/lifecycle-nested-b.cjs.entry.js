'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const output = require('./output-ea16c9f6.js');

const Cmpb = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output.output('componentWillLoad-b');
  }
  async componentDidLoad() {
    output.output('componentDidLoad-b');
  }
  render() {
    return index.h("slot", null);
  }
};

exports.lifecycle_nested_b = Cmpb;
