import { r as e, f as c, h as i } from "./p-55339060.js";

const t = class {
  constructor(i) {
    e(this, i), this.lifecycleLoad = c(this, "lifecycleLoad", 7), this.lifecycleUpdate = c(this, "lifecycleUpdate", 7), 
    this.value = "", this.rendered = 0;
  }
  componentWillLoad() {
    this.lifecycleLoad.emit("componentWillLoad-c");
  }
  componentDidLoad() {
    this.lifecycleLoad.emit("componentDidLoad-c");
  }
  componentWillUpdate() {
    this.lifecycleUpdate.emit("componentWillUpdate-c");
  }
  componentDidUpdate() {
    this.lifecycleUpdate.emit("componentDidUpdate-c");
  }
  render() {
    return this.rendered++, i("div", null, i("hr", null), i("div", null, "LifecycleBasicC ", this.value), i("div", {
      class: "rendered-c"
    }, "rendered c: ", this.rendered));
  }
};

export { t as lifecycle_basic_c }