'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeHtmlRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.strAttr = undefined;
    this.anyAttr = undefined;
    this.nuAttr = undefined;
  }
  render() {
    return [
      index.h("p", null, "strAttr:", ' ', index.h("strong", { id: "str-attr" }, this.strAttr, " ", typeof this.strAttr)),
      index.h("p", null, "anyAttr:", ' ', index.h("strong", { id: "any-attr" }, this.anyAttr, " ", typeof this.anyAttr)),
      index.h("p", null, "nuAttr:", ' ', index.h("strong", { id: "nu-attr" }, this.nuAttr, " ", typeof this.nuAttr)),
    ];
  }
};

exports.attribute_html_root = AttributeHtmlRoot;
