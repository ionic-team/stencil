import { Host, h } from '@stencil/core';
export class DomReattachCloneHost {
  render() {
    return (h(Host, null, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
  static get is() { return "dom-reattach-clone-host"; }
}
