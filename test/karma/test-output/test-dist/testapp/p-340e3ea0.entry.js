import { r as t, h as s } from "./p-55339060.js";

const e = class {
  constructor(s) {
    t(this, s), this._getter = "getter", this.single = "single", this.multiWord = "multiWord", 
    this.customAttr = "my-custom-attr";
  }
  get getter() {
    return this._getter;
  }
  set getter(t) {
    this._getter = t;
  }
  render() {
    return s("div", null, s("div", {
      class: "single"
    }, this.single), s("div", {
      class: "multiWord"
    }, this.multiWord), s("div", {
      class: "customAttr"
    }, this.customAttr), s("div", {
      class: "getter"
    }, this.getter), s("div", null, s("label", {
      class: "htmlForLabel",
      htmlFor: "a"
    }, "htmlFor"), s("input", {
      type: "checkbox",
      id: "a"
    })));
  }
};

export { e as attribute_basic }