import { h } from '@stencil/core';
export class SlotReorder {
  constructor() {
    this.reordered = false;
  }
  render() {
    if (this.reordered) {
      return (h("div", { class: "reordered" }, h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b")), h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a"))));
    }
    return (h("div", null, h("slot", null, h("div", null, "fallback default")), h("slot", { name: "slot-a" }, h("div", null, "fallback slot-a")), h("slot", { name: "slot-b" }, h("div", null, "fallback slot-b"))));
  }
  static get is() { return "slot-reorder"; }
  static get properties() {
    return {
      "reordered": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "reordered",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
}
