import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
};

export { SlotBasic as slot_basic };
