import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';
import { t as timeout } from './util-1e0c6298.js';

const LifecycleAsyncC = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
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
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-c');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
};

export { LifecycleAsyncC as lifecycle_async_c };
