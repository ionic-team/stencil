import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotDynamicWrapperRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.tag = 'section';
  }
  changeWrapper() {
    if (this.tag === 'section') {
      this.tag = 'article';
    }
    else {
      this.tag = 'section';
    }
  }
  render() {
    return [
      h("button", { onClick: this.changeWrapper.bind(this) }, "Change Wrapper"),
      h("slot-dynamic-wrapper", { tag: this.tag, class: "results1" }, h("h1", null, "parent text")),
    ];
  }
};

export { SlotDynamicWrapperRoot as slot_dynamic_wrapper_root };
