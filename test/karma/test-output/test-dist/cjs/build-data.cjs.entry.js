'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const BuildData = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("p", { class: "is-dev" }, "isDev: ", `${index.Build.isDev}`), index.h("p", { class: "is-browser" }, "isBrowser: ", `${index.Build.isBrowser}`), index.h("p", { class: "is-testing" }, "isTesting: ", `${index.Build.isTesting}`)));
  }
};

exports.build_data = BuildData;
