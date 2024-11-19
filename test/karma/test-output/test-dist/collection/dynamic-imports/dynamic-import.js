import { h } from '@stencil/core';
export class DynamicImport {
  constructor() {
    this.value = undefined;
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await import('./module1')).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return h("div", null, this.value);
  }
  static get is() { return "dynamic-import"; }
  static get states() {
    return {
      "value": {}
    };
  }
  static get methods() {
    return {
      "update": {
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
}
