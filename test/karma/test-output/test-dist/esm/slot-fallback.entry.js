import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotFallback = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("slot", { name: "start" }, "slot start fallback ", this.inc), h("section", null, h("slot", null, "slot default fallback ", this.inc)), h("article", null, h("span", null, h("slot", { name: "end" }, "slot end fallback ", this.inc)))));
  }
};

export { SlotFallback as slot_fallback };
