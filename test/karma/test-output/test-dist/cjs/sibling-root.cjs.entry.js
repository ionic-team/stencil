'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SiblingRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentWillLoad() {
    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  render() {
    return (index.h("div", null, index.h("section", null, "sibling-shadow-dom"), index.h("article", null, index.h("slot", null))));
  }
};
SiblingRoot.style = ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }";

exports.sibling_root = SiblingRoot;
