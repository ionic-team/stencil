import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './cmp17.js';

const SlotReplaceWrapperRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.href = undefined;
  }
  componentDidLoad() {
    this.href = 'http://stenciljs.com/';
  }
  render() {
    return (h("main", null, h("slot-replace-wrapper", { href: this.href, class: "results1" }, h("content-end", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results2" }, h("content-end", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results3" }, h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results4" }, h("content-start", { slot: "start" }, "A"), h("content-default", null, "B"), h("content-end", { slot: "end" }, "C")), h("slot-replace-wrapper", { href: this.href, class: "results5" }, h("content-default", null, "B"), h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A")), h("slot-replace-wrapper", { href: this.href, class: "results6" }, h("content-end", { slot: "end" }, "C"), h("content-start", { slot: "start" }, "A"), h("content-default", null, "B")), h("slot-replace-wrapper", { href: this.href, class: "results7" }, h("content-start", { slot: "start" }, "A1"), h("content-start", { slot: "start" }, "A2"), h("content-default", null, "B1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C1"), h("content-end", { slot: "end" }, "C2")), h("slot-replace-wrapper", { href: this.href, class: "results8" }, h("content-default", null, "B1"), h("content-end", { slot: "end" }, "C1"), h("content-start", { slot: "start" }, "A1"), h("content-default", null, "B2"), h("content-end", { slot: "end" }, "C2"), h("content-start", { slot: "start" }, "A2"))));
  }
}, [0, "slot-replace-wrapper-root", {
    "href": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-replace-wrapper-root", "slot-replace-wrapper"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-replace-wrapper-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotReplaceWrapperRoot$1);
      }
      break;
    case "slot-replace-wrapper":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SlotReplaceWrapperRoot = SlotReplaceWrapperRoot$1;
const defineCustomElement = defineCustomElement$1;

export { SlotReplaceWrapperRoot, defineCustomElement };
