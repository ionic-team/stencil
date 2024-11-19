import { h } from '@stencil/core';
export class SlotReplaceWrapperRoot {
  constructor() {
    this.href = undefined;
  }
  componentDidLoad() {
    this.href = 'http://stenciljs.com/';
  }
  render() {
    return (h("main", null, h("slot-replace-wrapper", { href: this.href, class: "results1" }, h("content-end", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results2" }, h("content-end", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results3" }, h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results4" }, h("content-start", { slot: "start" }, "A"), h("content-default", null, "B"), h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results5" }, h("content-default", null, "B"), h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results6" }, h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A"), h("content-default", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results7" }, h("content-start", { slot: "start" }, "A1"), h("content-start", { slot: "start" }, "A2"), h("content-default", null, "B1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C1"), h("content-end", { slot: "end" }, "C2")), h("slot-replace-wrapper", { href: this.href, class: "results8" }, h("content-default", null, "B1"), h("content-end", { slot: "end" }, "C1"), h("content-start", { slot: "start" }, "A1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C2"), h("content-start", { slot: "start" }, "A2"))));
  }
  static get is() { return "slot-replace-wrapper-root"; }
  static get states() {
    return {
      "href": {}
    };
  }
}
