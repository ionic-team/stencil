import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';

const LifecycleBasicB = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
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
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicB ", this.value), h("div", { class: "rendered-b" }, "rendered b: ", this.rendered), h("lifecycle-basic-c", { value: this.value })));
  }
};

export { LifecycleBasicB as lifecycle_basic_b };
