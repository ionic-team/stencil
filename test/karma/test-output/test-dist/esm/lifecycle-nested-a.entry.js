import { r as registerInstance, h } from './index-a2c0d171.js';
import { o as output } from './output-37e541c2.js';

const Cmpa = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output('componentWillLoad-a');
  }
  async componentDidLoad() {
    output('componentDidLoad-a');
  }
  render() {
    return h("slot", null);
  }
};

export { Cmpa as lifecycle_nested_a };
