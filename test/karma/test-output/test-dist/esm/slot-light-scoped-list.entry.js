import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotLightScopedList = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid green' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
};

export { SlotLightScopedList as slot_light_scoped_list };
