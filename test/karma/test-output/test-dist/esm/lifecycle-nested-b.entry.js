import { r as registerInstance, h } from './index-a2c0d171.js';
import { o as output } from './output-37e541c2.js';

const Cmpb = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output('componentWillLoad-b');
  }
  async componentDidLoad() {
    output('componentDidLoad-b');
  }
  render() {
    return h("slot", null);
  }
};

export { Cmpb as lifecycle_nested_b };
