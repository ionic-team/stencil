import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotDynamicWrapper = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.tag = 'section';
  }
  render() {
    return (h(this.tag, null, h("slot", null)));
  }
};

export { SlotDynamicWrapper as slot_dynamic_wrapper };
