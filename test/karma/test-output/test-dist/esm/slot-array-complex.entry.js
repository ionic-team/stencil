import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotArrayComplex = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [
      h("slot", { name: "start" }),
      h("section", null, h("slot", null)),
      h("slot", { name: "end" }),
    ];
  }
};

export { SlotArrayComplex as slot_array_complex };
