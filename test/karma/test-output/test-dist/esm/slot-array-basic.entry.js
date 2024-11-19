import { r as registerInstance, h } from './index-a2c0d171.js';

const cmpCss = "header{background:yellow;padding:10px}footer{background:limegreen;padding:10px}";

const SlotArrayBasic = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return [h("header", null, "Header"), h("slot", null), h("footer", null, "Footer")];
  }
};
SlotArrayBasic.style = cmpCss;

export { SlotArrayBasic as slot_array_basic };
