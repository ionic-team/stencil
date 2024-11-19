import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const SlotNoDefault = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", { name: "a-slot-name" }), h("section", null, h("slot", { name: "footer-slot-name" })), h("div", null, h("article", null, h("slot", { name: "nav-slot-name" })))));
  }
};

export { SlotNoDefault as slot_no_default };
