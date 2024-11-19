'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const StaticStyles = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("h1", null, "static get styles()")));
  }
};
StaticStyles.style = "h1 {\n        color: red;\n      }";

exports.static_styles = StaticStyles;
