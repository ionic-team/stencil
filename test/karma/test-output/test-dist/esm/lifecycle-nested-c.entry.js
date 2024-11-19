import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';
import { o as output } from './output-37e541c2.js';

const Cmpc = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  async componentWillLoad() {
    output('componentWillLoad-c');
  }
  componentDidLoad() {
    output('componentDidLoad-c');
  }
  render() {
    return (h(Host, null, h("div", null, "hello")));
  }
};

export { Cmpc as lifecycle_nested_c };
