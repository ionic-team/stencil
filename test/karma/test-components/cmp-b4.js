import { h } from '@stencil/core/internal/client';

const LifecycleUpdateB = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
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

export { LifecycleUpdateB as L };
