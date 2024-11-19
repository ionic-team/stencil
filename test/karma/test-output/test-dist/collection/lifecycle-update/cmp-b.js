import { h } from '@stencil/core';
export class LifecycleUpdateB {
  constructor() {
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return (h("section", null, "lifecycle-update-b: ", this.value, h("lifecycle-update-c", { value: this.value })));
  }
  static get is() { return "lifecycle-update-b"; }
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
