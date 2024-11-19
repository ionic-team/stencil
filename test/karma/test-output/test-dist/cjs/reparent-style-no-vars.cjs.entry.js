'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const reparentStyleNoVarsCss = ":host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleNoVars = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return index.h("div", { class: "css-entry" }, "No CSS Variables");
  }
};
ReparentStyleNoVars.style = reparentStyleNoVarsCss;

exports.reparent_style_no_vars = ReparentStyleNoVars;
