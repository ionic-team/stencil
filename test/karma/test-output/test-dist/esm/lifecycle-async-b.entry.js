import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';
import { t as timeout } from './util-1e0c6298.js';

const LifecycleAsyncB = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
    this.rendered = 0;
    this.value = '';
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit('componentWillLoad-b');
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit('componentDidLoad-b');
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit('componentWillUpdate-b');
    await timeout(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit('componentDidUpdate-b');
    await timeout(100);
  }
  render() {
    this.rendered++;
    return (h("div", null, h("hr", null), h("div", null, "LifecycleAsyncB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-async-c", { value: this.value })));
  }
};

export { LifecycleAsyncB as lifecycle_async_b };
