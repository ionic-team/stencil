'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const externalStore = require('./external-store-fba3adb1.js');
require('./external-data-a7517353.js');

const ExternalImportA = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentWillLoad() {
    const data = externalStore.store().data;
    this.first = data.first;
    this.last = data.last;
  }
  render() {
    return (index.h("div", null, this.first, " ", this.last));
  }
};

exports.external_import_a = ExternalImportA;
