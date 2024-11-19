'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleUnloadRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.renderCmp = true;
  }
  testClick() {
    this.renderCmp = !this.renderCmp;
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this) }, this.renderCmp ? 'Remove' : 'Add'), this.renderCmp ? index.h("lifecycle-unload-a", null) : null));
  }
};

exports.lifecycle_unload_root = LifecycleUnloadRoot;
