import { h } from '@stencil/core';
import { timeout } from './util';
export class LifecycleAsyncB {
  constructor() {
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-async-c", { value: this.value })));
  }
  static get is() { return "lifecycle-async-b"; }
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
