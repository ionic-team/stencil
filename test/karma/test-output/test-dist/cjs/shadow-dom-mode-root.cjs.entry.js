'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const ShadowDomModeRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.showRed = false;
  }
  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }
  render() {
    return (index.h("div", null, index.h("shadow-dom-mode", { id: "blue", colormode: "blue" }), this.showRed ? index.h("shadow-dom-mode", { id: "red" }) : null));
  }
};

exports.shadow_dom_mode_root = ShadowDomModeRoot;
