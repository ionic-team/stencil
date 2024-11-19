import { h } from '@stencil/core';
export class DomReattachClone {
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
  static get is() { return "dom-reattach-clone"; }
}
