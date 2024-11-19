'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const cmpRootCss = "div#relativeToRoot{background-image:url(\"/assets/favicon.ico?relativeToRoot\")}div#relative{background-image:url(\"../assets/favicon.ico?relative\")}div#absolute{background-image:url(\"https://www.google.com/favicon.ico\")}";

const InitCssRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return [index.h("div", { id: "relative" }), index.h("div", { id: "relativeToRoot" }), index.h("div", { id: "absolute" })];
  }
};
InitCssRoot.style = cmpRootCss;

exports.init_css_root = InitCssRoot;
