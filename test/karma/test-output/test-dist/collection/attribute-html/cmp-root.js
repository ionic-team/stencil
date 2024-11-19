import { h } from '@stencil/core';
export class AttributeHtmlRoot {
  constructor() {
    this.strAttr = undefined;
    this.anyAttr = undefined;
    this.nuAttr = undefined;
  }
  render() {
    return [
      h("p", null, "strAttr:", ' ', h("strong", { id: "str-attr" }, this.strAttr, " ", typeof this.strAttr)),
      h("p", null, "anyAttr:", ' ', h("strong", { id: "any-attr" }, this.anyAttr, " ", typeof this.anyAttr)),
      h("p", null, "nuAttr:", ' ', h("strong", { id: "nu-attr" }, this.nuAttr, " ", typeof this.nuAttr)),
    ];
  }
  static get is() { return "attribute-html-root"; }
  static get properties() {
    return {
      "strAttr": {
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
        "attribute": "str-attr",
        "reflect": false
      },
      "anyAttr": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "any",
          "resolved": "any",
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
        "attribute": "any-attr",
        "reflect": false
      },
      "nuAttr": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
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
        "attribute": "nu-attr",
        "reflect": false
      }
    };
  }
}
