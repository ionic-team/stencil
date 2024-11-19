export class ReflectToAttr {
  constructor() {
    this.str = 'single';
    this.nu = 2;
    this.undef = undefined;
    this.null = null;
    this.bool = false;
    this.otherBool = true;
    this.disabled = false;
    this.dynamicStr = undefined;
    this.dynamicNu = undefined;
  }
  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }
  static get is() { return "reflect-to-attr"; }
  static get properties() {
    return {
      "str": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
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
        "attribute": "str",
        "reflect": true,
        "defaultValue": "'single'"
      },
      "nu": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
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
        "attribute": "nu",
        "reflect": true,
        "defaultValue": "2"
      },
      "undef": {
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
        "attribute": "undef",
        "reflect": true
      },
      "null": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string | null",
          "resolved": "string",
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
        "attribute": "null",
        "reflect": true,
        "defaultValue": "null"
      },
      "bool": {
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
        "attribute": "bool",
        "reflect": true,
        "defaultValue": "false"
      },
      "otherBool": {
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
        "attribute": "other-bool",
        "reflect": true,
        "defaultValue": "true"
      },
      "disabled": {
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
        "attribute": "disabled",
        "reflect": true,
        "defaultValue": "false"
      },
      "dynamicStr": {
        "type": "string",
        "mutable": true,
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
        "attribute": "dynamic-str",
        "reflect": true
      },
      "dynamicNu": {
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
        "attribute": "dynamic-nu",
        "reflect": true
      }
    };
  }
  static get elementRef() { return "el"; }
}
