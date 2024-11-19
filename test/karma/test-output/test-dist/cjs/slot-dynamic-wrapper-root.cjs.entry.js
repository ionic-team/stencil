'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotDynamicWrapperRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.tag = 'section';
  }
  changeWrapper() {
    if (this.tag === 'section') {
      this.tag = 'article';
    }
    else {
      this.tag = 'section';
    }
  }
  render() {
    return [
      index.h("button", { onClick: this.changeWrapper.bind(this) }, "Change Wrapper"),
      index.h("slot-dynamic-wrapper", { tag: this.tag, class: "results1" }, index.h("h1", null, "parent text")),
    ];
  }
};

exports.slot_dynamic_wrapper_root = SlotDynamicWrapperRoot;
