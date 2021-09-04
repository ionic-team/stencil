import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotReplaceWrapper } from './cmp17.js';

const SlotReplaceWrapperRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentDidLoad() {
    this.href = 'http://stenciljs.com/';
  }
  render() {
    return (h("main", null, h("slot-replace-wrapper", { href: this.href, class: "results1" }, h("content-end", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results2" }, h("content-end", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results3" }, h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results4" }, h("content-start", { slot: "start" }, "A"), h("content-default", null, "B"), h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results5" }, h("content-default", null, "B"), h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results6" }, h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A"), h("content-default", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results7" }, h("content-start", { slot: "start" }, "A1"), h("content-start", { slot: "start" }, "A2"), h("content-default", null, "B1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C1"), h("content-end", { slot: "end" }, "C2")), h("slot-replace-wrapper", { href: this.href, class: "results8" }, h("content-default", null, "B1"), h("content-end", { slot: "end" }, "C1"), h("content-start", { slot: "start" }, "A1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C2"), h("content-start", { slot: "start" }, "A2"))));
  }
};

const SlotReplaceWrapperRoot = /*@__PURE__*/proxyCustomElement(SlotReplaceWrapperRoot$1, [0,"slot-replace-wrapper-root",{"href":[32]}]);
const components = ['slot-replace-wrapper-root', 'slot-replace-wrapper', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-replace-wrapper-root':
        tagName = 'slot-replace-wrapper-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotReplaceWrapperRoot);
        }
        break;

      case 'slot-replace-wrapper':
        tagName = 'slot-replace-wrapper';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const SlotReplaceWrapper$1 = /*@__PURE__*/proxyCustomElement(SlotReplaceWrapper, [0,"slot-replace-wrapper-root",{"href":[32]}]);
          customElements.define(tagName, SlotReplaceWrapper$1);
        }
        break;

    }
  });
};

export { SlotReplaceWrapperRoot, defineCustomElement };
