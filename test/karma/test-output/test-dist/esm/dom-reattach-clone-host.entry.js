import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const DomReattachCloneHost = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
};

export { DomReattachCloneHost as dom_reattach_clone_host };
