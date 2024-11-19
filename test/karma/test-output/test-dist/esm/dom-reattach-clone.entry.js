import { r as registerInstance, h } from './index-a2c0d171.js';

const DomReattachClone = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
};

export { DomReattachClone as dom_reattach_clone };
