'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleUpdateB = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    return (index.h("section", null, "lifecycle-update-b: ", this.value, index.h("lifecycle-update-c", { value: this.value })));
  }
};

exports.lifecycle_update_b = LifecycleUpdateB;
