import { h } from '@stencil/core';
export class SlotArrayComplexRoot {
  constructor() {
    this.endSlot = false;
  }
  componentDidLoad() {
    this.endSlot = !this.endSlot;
  }
  render() {
    return (h("main", null, h("slot-array-complex", null, h("header", { slot: "start" }, "slot - start"), "slot - default", this.endSlot ? h("footer", { slot: "end" }, "slot - end") : null)));
  }
  static get is() { return "slot-array-complex-root"; }
  static get states() {
    return {
      "endSlot": {}
    };
  }
}
