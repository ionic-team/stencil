import { h } from '@stencil/core';
export class LifecycleUpdateA {
  constructor() {
    this.values = [];
  }
  testClick() {
    this.values.push(this.values.length + 1);
    this.values = this.values.slice();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:gray">async add child components to lifecycle-update-a</span> ${this.values[this.values.length - 1]}`;
    document.getElementById('output').appendChild(li);
  }
  componentWillLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>`;
    document.getElementById('output').appendChild(li);
  }
  componentWillUpdate() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> ${this.values[this.values.length - 1]}`;
    document.getElementById('output').appendChild(li);
  }
  componentDidUpdate() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> ${this.values[this.values.length - 1]}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Add Child Components"), h("hr", null), this.values.map((value) => {
      return h("lifecycle-update-b", { value: value });
    })));
  }
  static get is() { return "lifecycle-update-a"; }
  static get states() {
    return {
      "values": {}
    };
  }
}
