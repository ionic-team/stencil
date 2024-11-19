'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const externalData = require('./external-data-a7517353.js');

const ExternalImportB = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentWillLoad() {
    this.first = externalData.data().first;
    this.last = externalData.data().last;
  }
  render() {
    return (index.h("div", null, this.first, " ", this.last));
  }
};

exports.external_import_c = ExternalImportB;
