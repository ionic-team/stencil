import { r as e, h as t } from "./p-55339060.js";

const n = class {
  constructor(t) {
    e(this, t), this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const e = document.createElement("li");
    return e.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> ${this.value}`, 
    document.getElementById("output").appendChild(e), new Promise((e => {
      setTimeout(e, 20);
    }));
  }
  componentDidLoad() {
    const e = document.createElement("li");
    e.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> ${this.value}`, 
    document.getElementById("output").appendChild(e);
  }
  render() {
    return t("section", null, "lifecycle-update-b: ", this.value, t("lifecycle-update-c", {
      value: this.value
    }));
  }
};

export { n as lifecycle_update_b }