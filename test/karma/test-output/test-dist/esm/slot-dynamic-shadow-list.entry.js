import { r as registerInstance, h } from './index-a2c0d171.js';

const DynamicListShadowComponent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.items = [];
  }
  render() {
    return (h("slot-light-list", null, this.items.map((item) => (h("div", null, item)))));
  }
};

export { DynamicListShadowComponent as slot_dynamic_shadow_list };
