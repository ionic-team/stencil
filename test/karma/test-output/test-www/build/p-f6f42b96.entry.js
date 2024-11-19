import { r as e, f as i, h as l } from "./p-55339060.js";

const t = class {
  constructor(l) {
    e(this, l), this.lifecycleLoad = i(this, "lifecycleLoad", 7), this.lifecycleUpdate = i(this, "lifecycleUpdate", 7), 
    this.value = "", this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit("componentWillLoad-b");
  }
  componentDidLoad() {
    this.lifecycleLoad.emit("componentDidLoad-b");
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit("componentWillUpdate-b");
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit("componentDidUpdate-b");
  }
  render() {
    return this.rendered++, l("div", null, l("hr", null), l("div", null, "LifecycleBasicB ", this.value), l("div", {
      class: "rendered-b"
    }, "rendered b: ", this.rendered), l("lifecycle-basic-c", {
      value: this.value
    }));
  }
};

export { t as lifecycle_basic_b }