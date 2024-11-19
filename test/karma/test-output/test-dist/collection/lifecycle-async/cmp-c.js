import { h } from '@stencil/core';
import { timeout } from './util';
export class LifecycleAsyncC {
  constructor() {
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
  static get is() { return "lifecycle-async-c"; }
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
