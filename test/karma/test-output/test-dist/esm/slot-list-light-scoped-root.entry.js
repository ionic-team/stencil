import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotListLightScopedRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.items = [];
  }
  needMore() {
    const newItems = [
      `Item ${this.items.length + 1}`,
      `Item ${this.items.length + 2}`,
      `Item ${this.items.length + 3}`,
      `Item ${this.items.length + 4}`,
    ];
    this.items = [...this.items, ...newItems];
  }
  render() {
    return (h("div", null, h("button", { onClick: () => this.needMore() }, "More"), h("slot-dynamic-scoped-list", { items: this.items })));
  }
};

export { SlotListLightScopedRoot as slot_list_light_scoped_root };
