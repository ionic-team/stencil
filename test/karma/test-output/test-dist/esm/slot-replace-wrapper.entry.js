import { r as registerInstance, h } from './index-a2c0d171.js';

const SlotReplaceWrapper = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.href = undefined;
  }
  render() {
    const TagType = (this.href != null ? 'a' : 'div');
    const attrs = (this.href != null ? { href: this.href, target: '_blank' } : {});
    return [
      h(TagType, Object.assign({}, attrs), h("slot", { name: "start" }), h("span", null, h("slot", null), h("span", null, h("slot", { name: "end" })))),
      h("hr", null),
    ];
  }
};

export { SlotReplaceWrapper as slot_replace_wrapper };
