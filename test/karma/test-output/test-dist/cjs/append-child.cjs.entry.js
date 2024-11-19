'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AppendChild = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("h1", null, "H1 Top", index.h("slot", { name: "h1" }), index.h("div", null, "H1 Bottom")), index.h("article", null, "Default Top", index.h("slot", null), "Default Bottom"), index.h("h6", null, index.h("section", null, "H6 Top", index.h("slot", { name: "h6" }), index.h("div", null, "H6 Bottom")))));
  }
};
AppendChild.style = "h1.sc-append-child {\n      color: red;\n      font-weight: bold;\n    }\n    article.sc-append-child {\n      color: green;\n      font-weight: bold;\n    }\n    section.sc-append-child {\n      color: blue;\n      font-weight: bold;\n    }";

exports.append_child = AppendChild;
