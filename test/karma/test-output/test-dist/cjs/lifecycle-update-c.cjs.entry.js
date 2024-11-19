'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleUpdateC = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    return index.h("span", null, " - lifecycle-update-c: ", this.value);
  }
};

exports.lifecycle_update_c = LifecycleUpdateC;
