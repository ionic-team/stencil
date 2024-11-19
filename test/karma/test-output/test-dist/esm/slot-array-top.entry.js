import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotArrayTop = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [h("span", null, "Content should be on top"), h("slot", null)];
  }
};

export { SlotArrayTop as slot_array_top };
