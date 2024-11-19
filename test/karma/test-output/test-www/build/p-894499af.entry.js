import { r as e, h as t } from "./p-55339060.js";

const n = class {
  constructor(t) {
    e(this, t), this.values = [];
  }
  testClick() {
    this.values.push(this.values.length + 1), this.values = this.values.slice();
    const e = document.createElement("li");
    e.innerHTML = `<span style="color:gray">async add child components to lifecycle-update-a</span> ${this.values[this.values.length - 1]}`, 
    document.getElementById("output").appendChild(e);
  }
  componentWillLoad() {
    const e = document.createElement("li");
    return e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>', 
    document.getElementById("output").appendChild(e), new Promise((e => {
      setTimeout(e, 10);
    }));
  }
  componentDidLoad() {
    const e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>', 
    document.getElementById("output").appendChild(e);
  }
  componentWillUpdate() {
    const e = document.createElement("li");
    e.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> ${this.values[this.values.length - 1]}`, 
    document.getElementById("output").appendChild(e);
  }
  componentDidUpdate() {
    const e = document.createElement("li");
    e.innerHTML = `<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> ${this.values[this.values.length - 1]}`, 
    document.getElementById("output").appendChild(e);
  }
  render() {
    return t("div", null, t("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Add Child Components"), t("hr", null), this.values.map((e => t("lifecycle-update-b", {
      value: e
    }))));
  }
};

export { n as lifecycle_update_a }