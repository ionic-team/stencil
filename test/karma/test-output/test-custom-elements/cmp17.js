import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const SlotReplaceWrapper = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.href = undefined;
  }
  render() {
    const TagType = (this.href != null ? 'a' : 'div');
    const attrs = (this.href != null ? { href: this.href, target: '_blank' } : {});
    return [
      h(TagType, Object.assign({}, attrs), h("slot", { name: "start" }), h("span", null, h("slot", null), h("span", null, h("slot", { name: "end" })))),
      h("hr", null),
    ];
  }
}, [4, "slot-replace-wrapper", {
    "href": [1]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["slot-replace-wrapper"];
  components.forEach(tagName => { switch (tagName) {
    case "slot-replace-wrapper":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SlotReplaceWrapper);
      }
      break;
  } });
}

export { SlotReplaceWrapper as S, defineCustomElement as d };
