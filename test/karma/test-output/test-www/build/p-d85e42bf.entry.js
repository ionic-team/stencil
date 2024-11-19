import { r as e, f as i, h as t } from "./p-55339060.js";

import { t as c } from "./p-eb8787be.js";

const l = class {
  constructor(t) {
    e(this, t), this.lifecycleLoad = i(this, "lifecycleLoad", 7), this.lifecycleUpdate = i(this, "lifecycleUpdate", 7), 
    this.rendered = 0, this.value = "";
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit("componentWillLoad-b");
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit("componentDidLoad-b");
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit("componentWillUpdate-b"), await c(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit("componentDidUpdate-b"), await c(100);
  }
  render() {
    return this.rendered++, t("div", null, t("hr", null), t("div", null, "LifecycleAsyncB ", this.value), t("div", {
      class: "rendered-b"
    }, "rendered b: ", this.rendered), t("lifecycle-async-c", {
      value: this.value
    }));
  }
};

export { l as lifecycle_async_b }