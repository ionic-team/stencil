import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotMapOrderRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    const items = ['a', 'b', 'c'];
    return (h("slot-map-order", null, items.map((item) => (h("div", null, h("input", { type: "text", value: item }))))));
  }
};

export { SlotMapOrderRoot as slot_map_order_root };
