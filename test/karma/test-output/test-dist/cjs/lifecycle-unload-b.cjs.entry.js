'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleUnloadB = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  componentDidLoad() {
    this.results = this.el.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }
  disconnectedCallback() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-b unload';
    this.results.appendChild(elm);
  }
  render() {
    return [
      index.h("article", null, "cmp-b - top"),
      index.h("section", null, index.h("slot", null)),
      index.h("nav", null, "cmp-b - bottom"),
    ];
  }
  get el() { return index.getElement(this); }
};

exports.lifecycle_unload_b = LifecycleUnloadB;
