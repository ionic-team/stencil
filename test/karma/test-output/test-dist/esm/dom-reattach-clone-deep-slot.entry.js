import { r as registerInstance, h } from './index-a2c0d171.js';

const DomReattachCloneDeep = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("div", null, h("section", null, h("slot", null)))));
  }
};

export { DomReattachCloneDeep as dom_reattach_clone_deep_slot };
