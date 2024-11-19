export class AttributeComplex {
  constructor() {
    this._obj = { name: 'James bond' };
    this.nu0 = 1;
    this.nu1 = undefined;
    this.nu2 = undefined;
    this.bool0 = true;
    this.bool1 = undefined;
    this.bool2 = undefined;
    this.str0 = 'hello';
    this.str1 = undefined;
    this.str2 = undefined;
  }
  get obj() {
    return JSON.stringify(this._obj);
  }
  set obj(newVal) {
    if (typeof newVal === 'string') {
      this._obj = { name: newVal };
    }
  }
  async getInstance() {
    return this;
  }
  static get is() { return "attribute-complex"; }
  static get properties() {
    return {
      "nu0": {
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
        "attribute": "nu-0",
        "reflect": false,
        "defaultValue": "1"
      },
      "nu1": {
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
        "attribute": "nu-1",
        "reflect": false
      },
      "nu2": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "SomeTypes.Number",
          "resolved": "number",
          "references": {
            "SomeTypes": {
              "location": "import",
              "path": "../util"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "nu-2",
        "reflect": false
      },
      "bool0": {
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
        "attribute": "bool-0",
        "reflect": false,
        "defaultValue": "true"
      },
      "bool1": {
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
        "attribute": "bool-1",
        "reflect": false
      },
      "bool2": {
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
        "attribute": "bool-2",
        "reflect": false
      },
      "str0": {
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
        "attribute": "str-0",
        "reflect": false,
        "defaultValue": "'hello'"
      },
      "str1": {
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
        "attribute": "str-1",
        "reflect": false
      },
      "str2": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "SomeTypes.String",
          "resolved": "string",
          "references": {
            "SomeTypes": {
              "location": "import",
              "path": "../util"
            }
          }
        },
        "required": false,
        "optional": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "getter": false,
        "setter": false,
        "attribute": "str-2",
        "reflect": false
      },
      "obj": {
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
        "getter": true,
        "setter": true,
        "attribute": "obj",
        "reflect": false
      }
    };
  }
  static get methods() {
    return {
      "getInstance": {
        "complexType": {
          "signature": "() => Promise<this>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<this>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
}
