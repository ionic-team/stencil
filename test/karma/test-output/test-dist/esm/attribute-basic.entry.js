import { r as registerInstance, h } from './index-a2c0d171.js';

const AttributeBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
};

export { AttributeBasic as attribute_basic };
