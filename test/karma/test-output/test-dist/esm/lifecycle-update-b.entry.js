import { r as registerInstance, h } from './index-a2c0d171.js';

const LifecycleUpdateB = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return (h("section", null, "lifecycle-update-b: ", this.value, h("lifecycle-update-c", { value: this.value })));
  }
};

export { LifecycleUpdateB as lifecycle_update_b };
