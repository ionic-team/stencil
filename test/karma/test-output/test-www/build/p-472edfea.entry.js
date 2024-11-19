import { r as t, h as s } from "./p-55339060.js";

const n = class {
  constructor(s) {
    t(this, s), this.showContent = !1;
  }
  testClick() {
    this.showContent = !this.showContent;
  }
  render() {
    return s("div", null, s("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Test"), s("div", {
      class: "results"
    }, this.showContent ? "Content" : ""));
  }
};

export { n as conditional_basic }