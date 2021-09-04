import { h } from '@stencil/core/internal/client';

const AttributeBasic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.single = 'single';
    this.multiWord = 'multiWord';
    this.customAttr = 'my-custom-attr';
  }
  render() {
    return (h("div", null, h("div", { class: "single" }, this.single), h("div", { class: "multiWord" }, this.multiWord), h("div", { class: "customAttr" }, this.customAttr), h("div", null, h("label", { class: "htmlForLabel", htmlFor: 'a' }, "htmlFor"), h("input", { type: "checkbox", id: 'a' }))));
  }
};

export { AttributeBasic as A };
