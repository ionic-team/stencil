import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const AttributeBasic = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this._getter = 'getter';
    this.single = 'single';
    this.multiWord = 'multiWord';
    this.customAttr = 'my-custom-attr';
  }
  get getter() {
    return this._getter;
  }
  set getter(newVal) {
    this._getter = newVal;
  }
  render() {
    return (h("div", null, h("div", { class: "single" }, this.single), h("div", { class: "multiWord" }, this.multiWord), h("div", { class: "customAttr" }, this.customAttr), h("div", { class: "getter" }, this.getter), h("div", null, h("label", { class: "htmlForLabel", htmlFor: 'a' }, "htmlFor"), h("input", { type: "checkbox", id: 'a' }))));
  }
}, [0, "attribute-basic", {
    "single": [1],
    "multiWord": [1, "multi-word"],
    "customAttr": [1, "my-custom-attr"],
    "getter": [6145]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["attribute-basic"];
  components.forEach(tagName => { switch (tagName) {
    case "attribute-basic":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, AttributeBasic);
      }
      break;
  } });
}

export { AttributeBasic as A, defineCustomElement as d };
