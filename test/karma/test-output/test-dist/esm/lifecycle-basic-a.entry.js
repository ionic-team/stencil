import { r as registerInstance, h } from './index-a2c0d171.js';

const LifecycleBasicA = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
    return (h("div", null, h("button", { onClick: this.testClick.bind(this), class: "test" }, "Update"), h("hr", null), h("div", null, "LifecycleBasicA ", this.value), h("div", { class: "rendered-a" }, "rendered a: ", this.rendered), h("div", null, "loads a:"), h("ol", { class: "lifecycle-loads-a" }, this.loads.map((load) => {
      return h("li", null, load);
    })), h("div", null, "updates a:"), h("ol", { class: "lifecycle-updates-a" }, this.updates.map((update) => {
      return h("li", null, update);
    })), h("lifecycle-basic-b", { value: this.value })));
  }
};

export { LifecycleBasicA as lifecycle_basic_a };
