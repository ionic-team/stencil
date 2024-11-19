'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotReplaceWrapper = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.href = undefined;
  }
  render() {
    const TagType = (this.href != null ? 'a' : 'div');
    const attrs = (this.href != null ? { href: this.href, target: '_blank' } : {});
    return [
      index.h(TagType, Object.assign({}, attrs), index.h("slot", { name: "start" }), index.h("span", null, index.h("slot", null), index.h("span", null, index.h("slot", { name: "end" })))),
      index.h("hr", null),
    ];
  }
};

exports.slot_replace_wrapper = SlotReplaceWrapper;
