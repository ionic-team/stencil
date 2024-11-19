import { h } from '@stencil/core';
export class SlotReplaceWrapper {
  constructor() {
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
  static get is() { return "slot-replace-wrapper"; }
  static get properties() {
    return {
      "href": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "href",
        "reflect": false
      }
    };
  }
}
