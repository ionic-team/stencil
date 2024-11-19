import { h, Host } from '@stencil/core';
export class DomReattach {
  constructor() {
    this.willLoad = 0;
    this.didLoad = 0;
    this.didUnload = 0;
  }
  componentWillLoad() {
    this.willLoad++;
  }
  componentDidLoad() {
    this.didLoad++;
  }
  disconnectedCallback() {
    this.didUnload++;
  }
  render() {
    return (h(Host, null, h("p", null, "componentWillLoad: ", this.willLoad), h("p", null, "componentDidLoad: ", this.didLoad), h("p", null, "disconnectedCallback: ", this.didUnload)));
  }
  static get is() { return "dom-reattach"; }
  static get properties() {
    return {
      "willLoad": {
        "type": "number",
        "mutable": true,
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
        "attribute": "will-load",
        "reflect": false,
        "defaultValue": "0"
      },
      "didLoad": {
        "type": "number",
        "mutable": true,
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
        "attribute": "did-load",
        "reflect": false,
        "defaultValue": "0"
      },
      "didUnload": {
        "type": "number",
        "mutable": true,
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
        "attribute": "did-unload",
        "reflect": false,
        "defaultValue": "0"
      }
    };
  }
}
