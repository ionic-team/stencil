import { h } from '@stencil/core';
export class SlotLightScopedList {
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid green' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
  static get is() { return "slot-light-scoped-list"; }
}
