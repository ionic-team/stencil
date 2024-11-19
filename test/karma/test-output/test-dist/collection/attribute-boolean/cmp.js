export class AttributeBoolean {
  constructor() {
    this.boolState = undefined;
    this.strState = undefined;
    this.noreflect = undefined;
  }
  static get is() { return "attribute-boolean"; }
  static get properties() {
    return {
      "boolState": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
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
        "attribute": "bool-state",
        "reflect": true
      },
      "strState": {
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
        "attribute": "str-state",
        "reflect": true
      },
      "noreflect": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
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
        "attribute": "noreflect",
        "reflect": false
      }
    };
  }
}
