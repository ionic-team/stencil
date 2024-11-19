import { h } from '@stencil/core';
export class AttributeBasic {
  constructor() {
    this._getter = 'getter';
    this.single = 'single';
    this.multiWord = 'multiWord';
    this.customAttr = 'my-custom-attr';
  }
  get getter() {
    return this._getter;
  }
  set getter(newVal) {
    this._getter = newVal;
  }
  render() {
    return (h("div", null, h("div", { class: "single" }, this.single), h("div", { class: "multiWord" }, this.multiWord), h("div", { class: "customAttr" }, this.customAttr), h("div", { class: "getter" }, this.getter), h("div", null, h("label", { class: "htmlForLabel", htmlFor: 'a' }, "htmlFor"), h("input", { type: "checkbox", id: 'a' }))));
  }
  static get is() { return "attribute-basic"; }
  static get properties() {
    return {
      "single": {
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
        "attribute": "single",
        "reflect": false,
        "defaultValue": "'single'"
      },
      "multiWord": {
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
        "attribute": "multi-word",
        "reflect": false,
        "defaultValue": "'multiWord'"
      },
      "customAttr": {
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
        "attribute": "my-custom-attr",
        "reflect": false,
        "defaultValue": "'my-custom-attr'"
      },
      "getter": {
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
        "attribute": "getter",
        "reflect": false,
        "defaultValue": "'getter'"
      }
    };
  }
}
