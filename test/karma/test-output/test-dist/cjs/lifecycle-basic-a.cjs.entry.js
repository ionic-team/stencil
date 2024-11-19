'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleBasicA = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.componentWillUpdated = false;
    this.componentDidUpdated = false;
    this.value = '';
    this.rendered = 0;
    this.loads = [];
    this.updates = [];
  }
  lifecycleLoad(ev) {
    this.loads = [...this.loads, ev.detail];
  }
  lifecycleUpdate(ev) {
    this.updates = [...this.updates, ev.detail];
  }
  componentWillLoad() {
    this.loads = [...this.loads, 'componentWillLoad-a'];
  }
  componentDidLoad() {
    this.loads = [...this.loads, 'componentDidLoad-a'];
  }
  componentWillUpdate() {
    if (this.value === 'Updated' && !this.componentWillUpdated) {
      this.updates = [...this.updates, 'componentWillUpdate-a'];
      this.componentWillUpdated = true;
    }
  }
  componentDidUpdate() {
    if (this.value === 'Updated' && !this.componentDidUpdated) {
      this.updates = [...this.updates, 'componentDidUpdate-a'];
      this.componentDidUpdated = true;
    }
  }
  testClick() {
    this.value = 'Updated';
  }
  render() {
    this.rendered++;
    return (index.h("div", null, index.h("button", { onClick: this.testClick.bind(this), class: "test" }, "Update"), index.h("hr", null), index.h("div", null, "LifecycleBasicA ", this.value), index.h("div", { class: "rendered-a" }, "rendered a: ", this.rendered), index.h("div", null, "loads a:"), index.h("ol", { class: "lifecycle-loads-a" }, this.loads.map((load) => {
      return index.h("li", null, load);
    })), index.h("div", null, "updates a:"), index.h("ol", { class: "lifecycle-updates-a" }, this.updates.map((update) => {
      return index.h("li", null, update);
    })), index.h("lifecycle-basic-b", { value: this.value })));
  }
};

exports.lifecycle_basic_a = LifecycleBasicA;
