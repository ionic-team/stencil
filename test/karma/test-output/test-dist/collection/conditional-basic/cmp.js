import { h } from '@stencil/core';
export class ConditionalBasic {
  constructor() {
    this.showContent = false;
  }
  testClick() {
    this.showContent = !this.showContent;
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Test"), h("div", { class: "results" }, this.showContent ? 'Content' : '')));
  }
  static get is() { return "conditional-basic"; }
  static get states() {
    return {
      "showContent": {}
    };
  }
}
