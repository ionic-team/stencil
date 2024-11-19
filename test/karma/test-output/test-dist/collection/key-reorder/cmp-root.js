import { h } from '@stencil/core';
export class KeyReorderRoot {
  constructor() {
    this.isReversed = false;
  }
  testClick() {
    this.isReversed = !this.isReversed;
  }
  render() {
    let items = [0, 1, 2, 3, 4];
    if (this.isReversed) {
      items.reverse();
    }
    return [
      h("button", { onClick: this.testClick.bind(this) }, "Test"),
      h("div", null, items.map((item) => {
        return (h("div", { key: item, id: 'item-' + item }, item));
      })),
    ];
  }
  static get is() { return "key-reorder-root"; }
  static get states() {
    return {
      "isReversed": {}
    };
  }
}
