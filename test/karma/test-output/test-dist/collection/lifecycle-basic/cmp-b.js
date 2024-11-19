import { h } from '@stencil/core';
export class LifecycleBasicB {
  constructor() {
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-basic-c", { value: this.value })));
  }
  static get is() { return "lifecycle-basic-b"; }
  static get properties() {
    return {
      "value": {
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
        "attribute": "value",
        "reflect": false,
        "defaultValue": "''"
      }
    };
  }
  static get states() {
    return {
      "rendered": {}
    };
  }
  static get events() {
    return [{
        "method": "lifecycleLoad",
        "name": "lifecycleLoad",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "lifecycleUpdate",
        "name": "lifecycleUpdate",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
}
