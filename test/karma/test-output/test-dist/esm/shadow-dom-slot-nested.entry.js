import { r as registerInstance, h } from './index-a2c0d171.js';

const ShadowDomSlotNested = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.i = undefined;
  }
  render() {
    return [
      h("header", null, "shadow dom: ", this.i),
      h("footer", null, h("slot", null)),
    ];
  }
};
ShadowDomSlotNested.style = "header {\n      color: red;\n    }";

export { ShadowDomSlotNested as shadow_dom_slot_nested };
