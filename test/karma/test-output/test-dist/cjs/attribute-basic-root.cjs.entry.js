'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const AttributeBasicRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentWillLoad() {
    this.url = new URL(window.location.href);
  }
  testClick() {
    const cmp = this.el.querySelector('attribute-basic');
    cmp.setAttribute('single', 'single-update');
    cmp.setAttribute('multi-word', 'multiWord-update');
    cmp.setAttribute('my-custom-attr', 'my-custom-attr-update');
    cmp.setAttribute('getter', 'getter-update');
  }
  render() {
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this) }, "Test"), index.h("attribute-basic", null), index.h("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname)));
  }
  get el() { return index.getElement(this); }
};

exports.attribute_basic_root = AttributeBasicRoot;
