import { h } from '@stencil/core/internal/client';

const SlotFallback = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.inc = 0;
  }
  render() {
    return (h("div", null, h("hr", null), h("slot", { name: "start" }, "slot start fallback ", this.inc), h("section", null, h("slot", null, "slot default fallback ", this.inc)), h("article", null, h("span", null, h("slot", { name: "end" }, "slot end fallback ", this.inc)))));
  }
};

export { SlotFallback as S };
