import { h } from '@stencil/core';
export class LifecycleBasicC {
  constructor() {
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
  static get is() { return "lifecycle-basic-c"; }
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
