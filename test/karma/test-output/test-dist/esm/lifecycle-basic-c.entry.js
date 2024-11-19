import { r as registerInstance, f as createEvent, h } from './index-a2c0d171.js';

const LifecycleBasicC = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.lifecycleLoad = createEvent(this, "lifecycleLoad", 7);
    this.lifecycleUpdate = createEvent(this, "lifecycleUpdate", 7);
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
    return (h("div", null, h("hr", null), h("div", null, "LifecycleBasicC ", this.value), h("div", { class: "rendered-c" }, "rendered c: ", this.rendered)));
  }
};

export { LifecycleBasicC as lifecycle_basic_c };
