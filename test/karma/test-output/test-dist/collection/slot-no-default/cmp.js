import { h, Host } from '@stencil/core';
export class SlotNoDefault {
  render() {
    return (h(Host, null, h("slot", { name: "a-slot-name" }), h("section", null, h("slot", { name: "footer-slot-name" })), h("div", null, h("article", null, h("slot", { name: "nav-slot-name" })))));
  }
  static get is() { return "slot-no-default"; }
}
