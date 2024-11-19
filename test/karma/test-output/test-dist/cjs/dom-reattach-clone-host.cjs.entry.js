'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const DomReattachCloneHost = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("span", { class: "component-mark-up" }, "Component mark-up"), index.h("slot", null)));
  }
};

exports.dom_reattach_clone_host = DomReattachCloneHost;
