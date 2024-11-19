import { r as registerInstance, h } from './index-a2c0d171.js';

const DynamicListScopedComponent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.items = [];
  }
  render() {
    return (h("slot-light-scoped-list", null, this.items.map((item) => (h("div", null, item)))));
  }
};

export { DynamicListScopedComponent as slot_dynamic_scoped_list };
