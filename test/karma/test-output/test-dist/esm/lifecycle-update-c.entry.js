import { r as registerInstance, h } from './index-a2c0d171.js';

const LifecycleUpdateC = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.value = 0;
  }
  componentWillLoad() {
    this.start = Date.now();
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:blue">componentWillLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
    return new Promise((resolve) => {
      setTimeout(resolve, 30);
    });
  }
  componentDidLoad() {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:orange">lifecycle-update-c</span> <span style="color:green">componentDidLoad</span> ${this.value}`;
    document.getElementById('output').appendChild(li);
  }
  render() {
    return h("span", null, " - lifecycle-update-c: ", this.value);
  }
};

export { LifecycleUpdateC as lifecycle_update_c };
