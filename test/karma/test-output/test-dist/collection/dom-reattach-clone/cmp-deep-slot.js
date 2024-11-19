import { h } from '@stencil/core';
export class DomReattachCloneDeep {
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("div", null, h("section", null, h("slot", null)))));
  }
  static get is() { return "dom-reattach-clone-deep-slot"; }
}
