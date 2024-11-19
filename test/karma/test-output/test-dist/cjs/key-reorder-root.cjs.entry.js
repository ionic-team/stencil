'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const KeyReorderRoot = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
      index.h("button", { onClick: this.testClick.bind(this) }, "Test"),
      index.h("div", null, items.map((item) => {
        return (index.h("div", { key: item, id: 'item-' + item }, item));
      })),
    ];
  }
};

exports.key_reorder_root = KeyReorderRoot;
