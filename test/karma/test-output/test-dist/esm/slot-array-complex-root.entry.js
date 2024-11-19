import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotArrayComplexRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.endSlot = false;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return (h("main", null, h("slot-array-complex", null, h("header", { slot: "start" }, "slot - start"), "slot - default", this.endSlot ? h("footer", { slot: "end" }, "slot - end") : null)));
  }
};

export { SlotArrayComplexRoot as slot_array_complex_root };
