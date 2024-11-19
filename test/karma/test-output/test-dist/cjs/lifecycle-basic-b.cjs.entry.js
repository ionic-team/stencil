'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleBasicB = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.lifecycleLoad = index.createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = index.createEvent(this, "lifecycleUpdate", 7);
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
  }
  render() {
    this.rendered++;
    return (index.h("div", null, index.h("hr", null), index.h("div", null, "LifecycleBasicB ", this.value), index.h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), index.h("lifecycle-basic-c", { value: this.value })));
  }
};

exports.lifecycle_basic_b = LifecycleBasicB;
