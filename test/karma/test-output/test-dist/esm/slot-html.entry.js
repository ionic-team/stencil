import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotHtml = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("article", null, h("span", null, h("slot", { name: "start" }))), h("slot", null), h("section", null, h("slot", { name: "end" }))));
  }
};

export { SlotHtml as slot_html };
