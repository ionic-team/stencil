import { h } from '@stencil/core';
export class SlotDynamicWrapperRoot {
  constructor() {
    this.tag = 'section';
  }
  changeWrapper() {
    if (this.tag === 'section') {
      this.tag = 'article';
    }
    else {
      this.tag = 'section';
    }
  }
  render() {
    return [
      h("button", { onClick: this.changeWrapper.bind(this) }, "Change Wrapper"),
      h("slot-dynamic-wrapper", { tag: this.tag, class: "results1" }, h("h1", null, "parent text")),
    ];
  }
  static get is() { return "slot-dynamic-wrapper-root"; }
  static get states() {
    return {
      "tag": {}
    };
  }
}
