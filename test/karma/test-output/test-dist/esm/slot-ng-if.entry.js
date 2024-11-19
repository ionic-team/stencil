import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const AngularSlotBinding = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};

export { AngularSlotBinding as slot_ng_if };
