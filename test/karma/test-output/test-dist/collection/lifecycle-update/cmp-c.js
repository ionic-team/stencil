import { h } from '@stencil/core';
export class LifecycleUpdateC {
  constructor() {
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 30);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return h("span", null, " - lifecycle-update-c: ", this.value);
  }
  static get is() { return "lifecycle-update-c"; }
  static get properties() {
    return {
      "value": {
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
        "attribute": "value",
        "reflect": false,
        "defaultValue": "0"
      }
    };
  }
}
