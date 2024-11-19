import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotLightList = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid blue' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
};

export { SlotLightList as slot_light_list };
