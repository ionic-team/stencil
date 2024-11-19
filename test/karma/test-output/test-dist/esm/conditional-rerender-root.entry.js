import { r as registerInstance, h } from './index-a2c0d171.js';

const ConditionalRerenderRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.showContent = false;
    this.showFooter = false;
  }
  componentDidLoad() {
    this.showFooter = true;
    setTimeout(() => (this.showContent = true), 20);
  }
  render() {
    return (h("conditional-rerender", null, h("header", null, "Header"), this.showContent ? h("section", null, "Content") : null, this.showFooter ? h("footer", null, "Footer") : null));
  }
};

export { ConditionalRerenderRoot as conditional_rerender_root };
