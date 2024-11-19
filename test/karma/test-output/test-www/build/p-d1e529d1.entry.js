import { r as e, f as c, h as t } from "./p-55339060.js";

import { t as i } from "./p-eb8787be.js";

const l = class {
  constructor(t) {
    e(this, t), this.lifecycleLoad = c(this, "lifecycleLoad", 7), this.lifecycleUpdate = c(this, "lifecycleUpdate", 7), 
    this.rendered = 0, this.value = "";
  }
  async componentWillLoad() {
    this.lifecycleLoad.emit("componentWillLoad-c");
  }
  async componentDidLoad() {
    this.lifecycleLoad.emit("componentDidLoad-c");
  }
  async componentWillUpdate() {
    this.lifecycleUpdate.emit("componentWillUpdate-c"), await i(100);
  }
  async componentDidUpdate() {
    this.lifecycleUpdate.emit("componentDidUpdate-c"), await i(100);
  }
  render() {
    return this.rendered++, t("div", null, t("hr", null), t("div", null, "LifecycleAsyncC ", this.value), t("div", {
      class: "rendered-c"
    }, "rendered c: ", this.rendered));
  }
};

export { l as lifecycle_async_c }