'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const util = require('./util-79fb7307.js');

const LifecycleAsyncC = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.lifecycleLoad = index.createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = index.createEvent(this, "lifecycleUpdate", 7);
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-c');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-c');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-c');
    await util.timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
    await util.timeout(100);
  }
  render() {
    this.rendered++;
    return (index.h("div", null, index.h("hr", null), index.h("div", null, "LifecycleAsyncC ", this.value), index.h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
};

exports.lifecycle_async_c = LifecycleAsyncC;
