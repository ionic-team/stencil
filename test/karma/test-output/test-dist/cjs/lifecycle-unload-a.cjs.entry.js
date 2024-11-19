'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleUnloadA = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }
  disconnectedCallback() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-a unload';
    this.results.appendChild(elm);
  }
  render() {
    return (index.h("main", null, index.h("header", null, "cmp-a - top"), index.h("lifecycle-unload-b", null, "cmp-a - middle"), index.h("footer", null, "cmp-a - bottom")));
  }
  get el() { return index.getElement(this); }
};

exports.lifecycle_unload_a = LifecycleUnloadA;
