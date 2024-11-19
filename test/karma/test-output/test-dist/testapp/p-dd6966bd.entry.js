import { r as t, h as e } from "./p-55339060.js";

const s = class {
  constructor(e) {
    t(this, e), this.rendered = 0, this.componentWillUpdated = !1, this.componentDidUpdated = !1, 
    this.value = "", this.loads = [], this.updates = [];
  }
  lifecycleLoad(t) {
    this.loads = [ ...this.loads, t.detail ];
  }
  lifecycleUpdate(t) {
    this.updates = [ ...this.updates, t.detail ];
  }
  async componentWillLoad() {
    this.loads = [ ...this.loads, "componentWillLoad-a" ];
  }
  async componentDidLoad() {
    this.loads = [ ...this.loads, "componentDidLoad-a" ];
  }
  async componentWillUpdate() {
    "Updated" !== this.value || this.componentWillUpdated || (this.updates = [ ...this.updates, "componentWillUpdate-a" ], 
    this.componentWillUpdated = !0);
  }
  async componentDidUpdate() {
    "Updated" !== this.value || this.componentDidUpdated || (this.updates = [ ...this.updates, "componentDidUpdate-a" ], 
    this.componentDidUpdated = !0);
  }
  testClick() {
    this.value = "Updated";
  }
  render() {
    return this.rendered++, e("div", null, e("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Update"), e("hr", null), e("div", null, "LifecycleAsyncA ", this.value), e("div", {
      class: "rendered-a"
    }, "rendered a: ", this.rendered), e("div", null, "loads a:"), e("ol", {
      class: "lifecycle-loads-a"
    }, this.loads.map((t => e("li", null, t)))), e("div", null, "updates a:"), e("ol", {
      class: "lifecycle-updates-a"
    }, this.updates.map((t => e("li", null, t)))), e("lifecycle-async-b", {
      value: this.value
    }));
  }
};

export { s as lifecycle_async_a }