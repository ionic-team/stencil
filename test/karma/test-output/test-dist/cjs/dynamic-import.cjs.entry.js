'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const DynamicImport = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.value = undefined;
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await Promise.resolve().then(function () { return require('./module1-a46c7096.js'); })).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return index.h("div", null, this.value);
  }
};

exports.dynamic_import = DynamicImport;
