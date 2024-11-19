import { r as registerInstance, h } from './index-a2c0d171.js';

const KeyReorderRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
};

export { KeyReorderRoot as key_reorder_root };
