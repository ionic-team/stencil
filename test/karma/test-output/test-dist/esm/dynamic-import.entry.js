import { r as registerInstance, h } from './index-a2c0d171.js';

const DynamicImport = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.value = undefined;
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await import('./module1-18894616.js')).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return h("div", null, this.value);
  }
};

export { DynamicImport as dynamic_import };
