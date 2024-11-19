'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const modeBlueCss = ":host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}";

const modeRedCss = ":host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}";

const ShadowDomMode = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.mode = index.getMode(this);
  }
  render() {
    return index.h("div", null, this.mode);
  }
};
ShadowDomMode.style = {
  blue: modeBlueCss,
  red: modeRedCss
};

exports.shadow_dom_mode = ShadowDomMode;
