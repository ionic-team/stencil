import { h } from '@stencil/core';
export class SlotLightList {
  render() {
    return [
      h("section", null, "These are my items:"),
      h("article", { class: "list-wrapper", style: { border: '2px solid blue' } }, h("slot", null)),
      h("div", null, "That's it...."),
    ];
  }
  static get is() { return "slot-light-list"; }
}
