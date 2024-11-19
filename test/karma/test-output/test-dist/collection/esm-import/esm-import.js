import { h } from '@stencil/core';
export class EsmImport {
  constructor() {
    this.propVal = 0;
    this.isReady = 'false';
    this.stateVal = undefined;
    this.listenVal = 0;
    this.someEventInc = 0;
  }
  testClick() {
    this.listenVal++;
  }
  async someMethod() {
    this.someEvent.emit();
  }
  testMethod() {
    this.el.someMethod();
  }
  componentWillLoad() {
    this.stateVal = 'mph';
    this.el.componentOnReady().then(() => {
      this.isReady = 'true';
    });
  }
  componentDidLoad() {
    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }
  render() {
    return (h("div", null, h("h1", null, "esm-import"), h("p", { id: "propVal" }, "propVal: ", this.propVal), h("p", { id: "stateVal" }, "stateVal: ", this.stateVal), h("p", { id: "listenVal" }, "listenVal: ", this.listenVal), h("p", null, h("button", { onClick: this.testMethod.bind(this) }, "Test")), h("p", { id: "isReady" }, "componentOnReady: ", this.isReady)));
  }
  static get is() { return "esm-import"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["esm-import.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["esm-import.css"]
    };
  }
  static get properties() {
    return {
      "propVal": {
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
        "attribute": "prop-val",
        "reflect": false,
        "defaultValue": "0"
      }
    };
  }
  static get states() {
    return {
      "isReady": {},
      "stateVal": {},
      "listenVal": {},
      "someEventInc": {}
    };
  }
  static get events() {
    return [{
        "method": "someEvent",
        "name": "someEvent",
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
  static get methods() {
    return {
      "someMethod": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "el"; }
  static get listeners() {
    return [{
        "name": "click",
        "method": "testClick",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
