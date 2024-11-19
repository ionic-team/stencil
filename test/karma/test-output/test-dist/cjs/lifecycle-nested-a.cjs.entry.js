'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const output = require('./output-ea16c9f6.js');

const Cmpa = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output.output('componentWillLoad-a');
  }
  async componentDidLoad() {
    output.output('componentDidLoad-a');
  }
  render() {
    return index.h("slot", null);
  }
};

exports.lifecycle_nested_a = Cmpa;
