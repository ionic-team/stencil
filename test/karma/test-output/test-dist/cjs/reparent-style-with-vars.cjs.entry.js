'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const reparentStyleWithVarsCss = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleWithVars = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return index.h("div", { class: "css-entry" }, "With CSS Vars");
  }
};
ReparentStyleWithVars.style = reparentStyleWithVarsCss;

exports.reparent_style_with_vars = ReparentStyleWithVars;
