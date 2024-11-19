'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const SlotReplaceWrapperRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.href = undefined;
  }
  componentDidLoad() {
    this.href = 'http://stenciljs.com/';
  }
  render() {
    return (index.h("main", null, index.h("slot-replace-wrapper", { href: this.href, class: "results1" }, index.h("content-end", { slot: "start" }, "A")), index.h("slot-replace-wrapper", { href: this.href, class: "results2" }, index.h("content-end", null, "B")), index.h("slot-replace-wrapper", { href: this.href, class: "results3" }, index.h("content-end", { slot: "end" }, "C")), index.h("slot-replace-wrapper", { href: this.href, class: "results4" }, index.h("content-start", { slot: "start" }, "A"), index.h("content-default", null, "B"), index.h("content-end", { slot: "end" }, "C")), index.h("slot-replace-wrapper", { href: this.href, class: "results5" }, index.h("content-default", null, "B"), index.h("content-end", { slot: "end" }, "C"), index.h("content-start", { slot: "start" }, "A")), index.h("slot-replace-wrapper", { href: this.href, class: "results6" }, index.h("content-end", { slot: "end" }, "C"), index.h("content-start", { slot: "start" }, "A"), index.h("content-default", null, "B")), index.h("slot-replace-wrapper", { href: this.href, class: "results7" }, index.h("content-start", { slot: "start" }, "A1"), index.h("content-start", { slot: "start" }, "A2"), index.h("content-default", null, "B1"), index.h("content-default", null, "B2"), index.h("content-end", { slot: "end" }, "C1"), index.h("content-end", { slot: "end" }, "C2")), index.h("slot-replace-wrapper", { href: this.href, class: "results8" }, index.h("content-default", null, "B1"), index.h("content-end", { slot: "end" }, "C1"), index.h("content-start", { slot: "start" }, "A1"), index.h("content-default", null, "B2"), index.h("content-end", { slot: "end" }, "C2"), index.h("content-start", { slot: "start" }, "A2"))));
  }
};

exports.slot_replace_wrapper_root = SlotReplaceWrapperRoot;
