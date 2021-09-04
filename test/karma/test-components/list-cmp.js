import { h } from '@stencil/core/internal/client';

const SlotLightScopedList = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid green' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
};

export { SlotLightScopedList as S };
