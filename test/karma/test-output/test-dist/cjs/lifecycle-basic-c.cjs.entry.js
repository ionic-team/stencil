'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const LifecycleBasicC = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.lifecycleLoad = index.createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = index.createEvent(this, "lifecycleUpdate", 7);
    this.value = '';
    this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
  }
  render() {
    this.rendered++;
    return (index.h("div", null, index.h("hr", null), index.h("div", null, "LifecycleBasicC ", this.value), index.h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
};

exports.lifecycle_basic_c = LifecycleBasicC;
